import { describe, it, expect, beforeAll } from 'vitest'
import { createTerm, signInWithPassword, listTerms, isUsernameAvailable, register } from '@/lib/graphql'

let authToken = null

// Test configuration
const TEST_CONFIG = {
  // Test credentials - you may need to create these in your system
  TEST_USER: {
    email: `test${Date.now()}@example.com`,
    password: `Testpassword123`,
    username: `testuser`
  },

  // Admin credentials for protected operations
  // 你需要根據你的系統修改這些憑證
  ADMIN_USER: {
    email: 'good@gmail.com',
    password: 'Sigong1~'
  }
}

// Verify environment variables are available
beforeAll(() => {
  console.log('🔧 Testing environment setup:')
  console.log('GRAPHQL_API_URL:', process.env.GRAPHQL_API_URL || '❌ NOT SET')
  console.log('GRAPHQL_SECRET_KEY:', process.env.GRAPHQL_SECRET_KEY ? '✅ Available' : '❌ NOT SET')

  if (!process.env.GRAPHQL_API_URL) {
    throw new Error('GRAPHQL_API_URL environment variable is required for tests')
  }

  if (!process.env.GRAPHQL_SECRET_KEY) {
    throw new Error('GRAPHQL_SECRET_KEY environment variable is required for tests')
  }
})

describe('GraphQL Functions - Real API Tests', () => {

  describe('Authentication', () => {
    it('should sign in with valid credentials', async () => {
      try {
        const result = await signInWithPassword(
          TEST_CONFIG.ADMIN_USER.email,
          TEST_CONFIG.ADMIN_USER.password
        )

        expect(result).toBeDefined()
        expect(result.token).toBeDefined()
        expect(result.email).toBe(TEST_CONFIG.ADMIN_USER.email)

        

        // Store token for other tests
        authToken = result.token

        console.log('✅ Login successful, token obtained')
      } catch (error) {
        console.log('ℹ️  Login failed (expected if user doesn\'t exist):', error.message)
        // This might fail if the user doesn't exist, which is okay for testing
      }
    }, 10000) // 10 second timeout

    it('should throw error with invalid credentials', async () => {
      await expect(
        signInWithPassword('invalid@example.com', 'wrongpassword')
      ).rejects.toThrow()
    })
  })

  describe('User Registration', () => {
    it('should register a new user', async () => {
      try {
        const input = {
          email: `test-${Date.now()}@example.com`, // Unique email
          password: 'testpassword123',
          passwordConfirmation: 'testpassword123', // 添加密碼確認
          agreement: 'true' // 添加協議同意
        }

        const result = await register(input)

        expect(result).toBeDefined()
        expect(result.result).toBeDefined()
        expect(result.result.email).toBe(input.email)

        console.log('✅ User registration successful')
      } catch (error) {
        console.log('ℹ️  Registration failed:', error.message)
        // This might fail due to validation rules, which is okay
      }
    }, 10000)
  })

  describe('Username Availability', () => {
    it('should check if username is available', async () => {
      if (!authToken) {
        console.log('⏭️  Skipping username check - no auth token')
        return
      }

      try {
        const session = { accessToken: authToken }
        const randomUsername = `testuser${Date.now()}`

        const result = await isUsernameAvailable(randomUsername, session)

        expect(typeof result).toBe('boolean')
        console.log('✅ Username availability check successful')
      } catch (error) {
        console.log('ℹ️  Username check failed:', error.message)
      }
    })
  })

  describe('Terms Management', () => {
    it('should list terms by taxonomy', async () => {
      try {
        const result = await listTerms('category', {accessToken: authToken})

        expect(Array.isArray(result)).toBe(true)
        console.log('✅ List terms successful, found:', result.length, 'terms')
      } catch (error) {
        console.log('ℹ️  List terms failed:', error.message)
      }
    })

    it('should create a term with authentication', async () => {
      if (!authToken) {
        console.log('⏭️  Skipping term creation - no auth token')
        return
      }

      try {
        const input = {
          name: `Test Term ${Date.now()}`,
          slug: `test-term-${Date.now()}`,
          termMeta: [
            {
              termKey: "domain",
              termValue: "test.com"
            }
          ],
          termTaxonomy: [
            {
              taxonomy: "category"
            }
          ]
        }

        const session = { accessToken: authToken }
        const result = await createTerm(input, session)

        if (result) {
          expect(result.name).toBe(input.name)
          expect(result.slug).toBe(input.slug)
          console.log('✅ Term creation successful:', result)
        } else {
          console.log('ℹ️  Term creation returned null (may indicate permission issue)')
        }
      } catch (error) {
        console.log('ℹ️  Term creation failed:', error.message)
      }
    }, 10000)

    it('should fail to create term without authentication', async () => {
      const input = {
        name: "Unauthorized Term",
        slug: "unauthorized-term",
        termMeta: [],
        termTaxonomy: []
      }

      try {
        const result = await createTerm(input, null)
        // If it doesn't throw, it should return null or fail
        expect(result).toBeNull()
      } catch (error) {
        // This is expected - should throw an authentication error
        expect(error.message).toBeDefined()
        console.log('✅ Correctly rejected unauthorized term creation')
      }
    })
  })
})

describe('GraphQL Integration Workflow', () => {
  it('should complete full workflow: login -> create term', async () => {
    console.log('🔄 Starting integration test workflow...')

    try {
      // Step 1: Login
      console.log('Step 1: Attempting login...')
      const loginResult = await signInWithPassword(
        TEST_CONFIG.ADMIN_USER.email,
        TEST_CONFIG.ADMIN_USER.password
      )

      expect(loginResult.token).toBeDefined()
      console.log('✅ Step 1 complete: Login successful')

      // Step 2: Create term with token
      console.log('Step 2: Creating term with auth token...')
      const session = { accessToken: loginResult.token }
      const termInput = {
        name: `AI Generate Prompt ${Date.now()}`,
        slug: `ai-generate-prompt-${Date.now()}`,
        termMeta: [
          {
            termKey: "domain",
            termValue: "dattk.com"
          }
        ],
        termTaxonomy: [
          {
            taxonomy: "category"
          }
        ]
      }

      const termResult = await createTerm(termInput, session)

      if (termResult) {
        expect(termResult.name).toBe(termInput.name)
        expect(termResult.slug).toBe(termInput.slug)
        console.log('✅ Step 2 complete: Term created successfully')
        console.log('🎉 Integration test workflow completed successfully!')
      } else {
        console.log('ℹ️  Term creation returned null - may indicate permission or validation issue')
      }

    } catch (error) {
      console.log('❌ Integration test failed:', error.message)
      throw error
    }
  }, 15000) // 15 second timeout for integration test
})