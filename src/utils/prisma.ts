
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const db = new PrismaClient({
    datasources:{
        db:{
            url:"prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZDkxMzViZWMtYmY5MS00N2FjLThjZWQtNzZjNGMyODZjMjlmIiwidGVuYW50X2lkIjoiNjU2MTJlZjY3NTg2MmIxZmQyYjJlYWIxOGYyYjEwMzVhMzRhMjU2YzJlYTFjN2U0ZWRjYzAwZmI5YzVmNzZhOCIsImludGVybmFsX3NlY3JldCI6ImRlMmVhMDQyLWU5YjAtNGQ1MC04N2QwLWQzY2M3Yjg3YjExMiJ9.z264k7izHIh9jPQ7RFV2UdKBjAfvp6bxAyRrMIq6bSg"
        }
    }
}).$extends(withAccelerate())