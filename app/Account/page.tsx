import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Building, Briefcase } from 'lucide-react'

export default function Account() {
  // Dummy user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, AN 12345",
    company: "Acme Corporation",
    position: "Senior Trader",
    avatar: "/placeholder.svg" // Replace with actual avatar image path
  }

  return (
    <div className="container mx-auto mt-10 px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.position}</p>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex">
                <Mail className="w-5 h-5 mr-2 text-gray-500" />
                <Input id="email" value={user.email} readOnly />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex">
                <Phone className="w-5 h-5 mr-2 text-gray-500" />
                <Input id="phone" value={user.phone} readOnly />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                <Input id="address" value={user.address} readOnly />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <div className="flex">
                <Building className="w-5 h-5 mr-2 text-gray-500" />
                <Input id="company" value={user.company} readOnly />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <div className="flex">
                <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                <Input id="position" value={user.position} readOnly />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

