'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { performanceMonitor, errorMonitor } from '@/lib/monitoring';
import { Activity, AlertTriangle, Clock, TrendingUp, RefreshCw } from 'lucide-react';

export function MonitoringDashboard() {
  const [performanceStats, setPerformanceStats] = useState(null);
  const [errorStats, setErrorStats] = useState(null);
  const [recentErrors, setRecentErrors] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshStats = () => {
    setPerformanceStats(performanceMonitor.getMetricsSummary());
    setErrorStats(errorMonitor.getErrorStats());
    setRecentErrors(errorMonitor.getRecentErrors(5));
    setLastUpdated(new Date());
  };

  useEffect(() => {
    refreshStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!performanceStats || !errorStats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading monitoring data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Monitoring Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button onClick={refreshStats} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.totalApiCalls}</div>
            <p className="text-xs text-muted-foreground">
              {performanceStats.recentApiCalls} in last 50 calls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(performanceStats.averageResponseTime)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Recent API calls average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(performanceStats.errorRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {errorStats.errorsLastHour} errors in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorStats.totalErrors}</div>
            <p className="text-xs text-muted-foreground">
              {errorStats.errorsLastDay} in last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceStats.slowestEndpoint && (
                  <div>
                    <h4 className="font-medium mb-2">Slowest Endpoint</h4>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-mono text-sm">
                        {performanceStats.slowestEndpoint.endpoint}
                      </span>
                      <Badge variant="secondary">
                        {Math.round(performanceStats.slowestEndpoint.responseTime)}ms
                      </Badge>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Performance Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total API Calls:</span>
                      <span className="ml-2 font-medium">{performanceStats.totalApiCalls}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Recent Calls:</span>
                      <span className="ml-2 font-medium">{performanceStats.recentApiCalls}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Average Response:</span>
                      <span className="ml-2 font-medium">
                        {Math.round(performanceStats.averageResponseTime)}ms
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Error Rate:</span>
                      <span className="ml-2 font-medium">
                        {(performanceStats.errorRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Error Counts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Errors:</span>
                        <Badge variant="destructive">{errorStats.totalErrors}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Hour:</span>
                        <Badge variant="secondary">{errorStats.errorsLastHour}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Day:</span>
                        <Badge variant="secondary">{errorStats.errorsLastDay}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Most Common Error</h4>
                    {errorStats.mostCommonError ? (
                      <div className="p-3 bg-red-50 rounded text-sm">
                        <div className="font-medium text-red-800">
                          {errorStats.mostCommonError.message}
                        </div>
                        <div className="text-red-600">
                          Occurred {errorStats.mostCommonError.count} times
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">No errors recorded</div>
                    )}
                  </div>
                </div>

                {recentErrors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recent Errors</h4>
                    <div className="space-y-2">
                      {recentErrors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{error.message}</div>
                                <div className="text-xs opacity-75">
                                  {error.context.component} - {error.context.action}
                                </div>
                              </div>
                              <div className="text-xs opacity-75">
                                {new Date(error.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Errors by Component</h4>
                  <div className="space-y-1">
                    {Object.entries(errorStats.errorsByComponent).map(([component, count]) => (
                      <div key={component} className="flex justify-between text-sm">
                        <span className="capitalize">{component.replace('_', ' ')}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analytics data will be available once Google Analytics is configured</p>
                <p className="text-sm mt-2">
                  Add NEXT_PUBLIC_GA_MEASUREMENT_ID to your environment variables
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}