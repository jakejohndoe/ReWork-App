const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function resetTestAccount() {
  try {
    console.log('🔍 Looking for test account...')

    // Find user by email patterns that might match your account
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: 'jake' } },
          { email: { contains: 'hellojakejohn' } },
          { email: { contains: 'john' } }
        ]
      },
      include: {
        resumes: true
      }
    })

    console.log(`Found ${users.length} potential users:`)
    users.forEach(user => {
      console.log(`- ${user.email} (resumesCreated: ${user.resumesCreated}, active resumes: ${user.resumes.length})`)
    })

    if (users.length === 0) {
      console.log('❌ No users found matching the search criteria')
      return
    }

    // Reset the first matching user (assuming it's you)
    const targetUser = users[0]
    console.log(`\n🔄 Resetting account for: ${targetUser.email}`)

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        resumesCreated: 0
      }
    })

    console.log(`✅ Reset complete! resumesCreated: ${updatedUser.resumesCreated}`)

    // Show the exact Prisma command for future use
    console.log('\n📋 For future reference, you can run this Prisma command:')
    console.log(`npx prisma db execute --stdin <<< "UPDATE users SET \\"resumesCreated\\" = 0 WHERE email = '${targetUser.email}';"`)

    console.log('\n🔧 Or use this Prisma Client code:')
    console.log(`
const updatedUser = await prisma.user.update({
  where: { email: '${targetUser.email}' },
  data: { resumesCreated: 0 }
})`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetTestAccount()