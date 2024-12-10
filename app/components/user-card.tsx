import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin } from 'lucide-react'

import MutableDialog from "@/components/mutable-dialog"
import { UserForm } from "./user-form"
import { userFormSchema, UserFormData } from "@/app/actions/schemas"
import { updateUser } from "@/app/actions/actions" // Add update user action

interface User {
  id: string
  name: string
  phoneNumber: string
  email?: string
  location?: string
}

interface UserCardProps {
  user: User
  onUserUpdate: (updatedUser: User) => void // Callback to handle updates
}

export function UserCard({ user, onUserUpdate }: UserCardProps) {
  const handleUpdateUser = async (data: UserFormData) => {
    try {
      const updatedUser = await updateUser(user.id, data)
      onUserUpdate(updatedUser) // Notify parent of changes
      return {
        success: true,
        message: `User ${updatedUser.name} updated successfully`,
        data: updatedUser
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to update user"
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <Badge variant="secondary" className="w-fit mt-1">ID: {user.id}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{user.phoneNumber}</span>
        </div>
        {user.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{user.location}</span>
          </div>
        )}
      </CardContent>
      <div className="p-4 flex justify-end">
        <MutableDialog<UserFormData>
          formSchema={userFormSchema}
          FormComponent={UserForm}
          action={handleUpdateUser}
          defaultValues={{
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email || "",
            location: user.location || "",
          }}
          triggerButtonLabel="Edit"
          editDialogTitle="Edit User"
          dialogDescription="Modify the user details and save changes."
          submitButtonLabel="Save"
        />
      </div>
    </Card>
  )
}
