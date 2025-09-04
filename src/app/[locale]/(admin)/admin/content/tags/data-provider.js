export const tagsDataProvider = {
  fetchData: async (params) => {
    const { limit, offset, filterField, filterValue, sortParam } = params;
    const requestBody = { limit, offset, filterField, filterValue, sortParam };

    const response = await fetch('/api/admin/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  },

  deleteData: async (ids) => {
    const response = await fetch('/api/admin/tags', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete tags.');
    }
    return await response.json();
  },
};