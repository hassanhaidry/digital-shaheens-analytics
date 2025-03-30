import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Administrator', status: 'Active' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Manager', status: 'Active' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'Analyst', status: 'Active' },
  { id: 4, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
];

const UserManagement: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600">Manage user access and permissions</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <i className="fas fa-plus mr-2"></i>
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Enter the details of the new user you want to add to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select>
                  <SelectTrigger id="role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-primary">Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white rounded-lg shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Input 
                placeholder="Search users..." 
                className="w-64"
              />
              <Button variant="outline" className="ml-2">
                <i className="fas fa-filter mr-1"></i>
                Filter
              </Button>
            </div>
            
            <Select defaultValue="active">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <i className="fas fa-edit text-gray-600"></i>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                      <i className="fas fa-trash"></i>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500">Showing 4 of 4 users</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                <i className="fas fa-chevron-left mr-1"></i>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <i className="fas fa-chevron-right ml-1"></i>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
