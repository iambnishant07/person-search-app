'use client'

import { useState } from 'react'
import AsyncSelect from 'react-select/async'
import { searchUsers } from '@/app/actions/actions'
import { UserCard } from './user-card'
import { User } from '@/app/actions/schemas'

// Option type remains the same
interface Option {
  value: string
  label: string
  user: User
}

export default function UserSearch() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const users = await searchUsers(inputValue)
  
    return users.map(user => ({
      value: user.id,
      label: user.name,
      user: {
        ...user,
        location: user.location === null ? undefined : user.location, // Ensure location is never null
      } as User, // Explicitly cast to User to ensure type compatibility
    }))
  }     

  const handleChange = (option: Option | null) => {
    setSelectedUser(option ? option.user : null)
  }

  const handleUserUpdate = (updatedUser: User | null) => {
    setSelectedUser(updatedUser) // Set null when user is deleted
  }

  return (
    <div className="space-y-6">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        placeholder="Search for a user..."
        className="w-full max-w-md mx-auto"
      />
      {selectedUser && <UserCard user={selectedUser} onUserUpdate={handleUserUpdate} />}
    </div>
  )
}
