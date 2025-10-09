"use client"
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Trash2, AlertTriangle, Loader2Icon, LoaderIcon } from 'lucide-react'
import { useUser } from '@/src/context/UserContext'
import toast from 'react-hot-toast'
import { DeleteUser } from '@/src/action/AuthenticatedUserAction'
import { useTransition } from 'react'

const DeleteUserForm = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useUser();
   const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    // Add your delete logic here
    console.log('Deleting user:', user);
    if (!user?.id) {
        return
    }
    startTransition(async () => {
      const res = await DeleteUser(user.id)
      if (res.success) {
         toast.success(res.message);
        setIsOpen(false)
      } else {
        toast.error(res.message || "Failed to update user");
        console.error(res.message || res.message)
      }
    })
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Delete User</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Are you sure you want to delete <strong>{user?.full_name || user?.email}</strong>? 
            This action cannot be undone. All user data will be permanently removed from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex gap-4">
          <AlertDialogCancel asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              {
                isPending ? <LoaderIcon className="animate-spin h-5 w-5" /> :null
              }
              <Trash2 className="h-4 w-4" />
              {isPending ? "Deleting" : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserForm;