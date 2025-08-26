import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Settings, 
  FileText, 
  Star, 
  DollarSign, 
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import backend from '~backend/client';

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

interface AdminDashboardProps {
  user: AdminUser;
  token: string;
  onLogout: () => void;
}

export default function AdminDashboard({ user, token, onLogout }: AdminDashboardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const authenticatedBackend = backend.with({
    auth: () => Promise.resolve({ authorization: `Bearer ${token}` })
  });

  // Queries
  const { data: services } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => backend.company.getServices({}),
    enabled: isVisible,
  });

  const { data: portfolios } = useQuery({
    queryKey: ['admin-portfolios'],
    queryFn: () => backend.company.getPortfolios({}),
    enabled: isVisible,
  });

  const { data: pricing } = useQuery({
    queryKey: ['admin-pricing'],
    queryFn: () => backend.company.getPricing({}),
    enabled: isVisible,
  });

  const { data: testimonials } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => backend.company.getTestimonials(),
    enabled: isVisible,
  });

  const { data: contacts } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: () => backend.company.getContactSubmissions({}),
    enabled: isVisible,
  });

  // Service mutations
  const createServiceMutation = useMutation({
    mutationFn: (data: any) => authenticatedBackend.company.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: "Service created successfully" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: (data: any) => authenticatedBackend.company.updateService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: "Service updated successfully" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id: number) => authenticatedBackend.company.deleteService({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: "Service deleted successfully" });
    },
  });

  // Portfolio mutations
  const createPortfolioMutation = useMutation({
    mutationFn: (data: any) => authenticatedBackend.company.createPortfolio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolios'] });
      toast({ title: "Portfolio created successfully" });
    },
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: (data: any) => authenticatedBackend.company.updatePortfolio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolios'] });
      toast({ title: "Portfolio updated successfully" });
    },
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: (id: number) => authenticatedBackend.company.deletePortfolio({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolios'] });
      toast({ title: "Portfolio deleted successfully" });
    },
  });

  // Pricing mutations
  const createPricingMutation = useMutation({
    mutationFn: (data: any) => authenticatedBackend.company.createPricing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      toast({ title: "Pricing package created successfully" });
    },
  });

  const updatePricingMutation = useMutation({
    mutationFn: (data: any) => authenticatedBackend.company.updatePricing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      toast({ title: "Pricing package updated successfully" });
    },
  });

  const deletePricingMutation = useMutation({
    mutationFn: (id: number) => authenticatedBackend.company.deletePricing({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      toast({ title: "Pricing package deleted successfully" });
    },
  });

  // Testimonial mutations
  const createTestimonialMutation = useMutation({
    mutationFn: (data: any) => authenticatedBackend.company.createTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({ title: "Testimonial created successfully" });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: (data: any) => authenticatedBackend.company.updateTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({ title: "Testimonial updated successfully" });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: number) => authenticatedBackend.company.deleteTestimonial({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({ title: "Testimonial deleted successfully" });
    },
  });

  const updateContactStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      backend.company.updateContactStatus({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast({ title: "Contact status updated successfully" });
    },
  });

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          size="sm"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-600">Welcome, {user.username} ({user.role})</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{services?.services.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{portfolios?.portfolios.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pricing Packages</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pricing?.packages.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{contacts?.total || 0}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Services</h3>
                <ServiceForm onSubmit={createServiceMutation.mutate} />
              </div>
              <div className="grid gap-4">
                {services?.services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <Badge variant="outline" className="mt-2">{service.category}</Badge>
                        </div>
                        <div className="flex space-x-2">
                          <ServiceForm 
                            service={service} 
                            onSubmit={(data) => updateServiceMutation.mutate({ ...data, id: service.id })}
                            isEdit
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteServiceMutation.mutate(service.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="portfolios" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Portfolios</h3>
                <PortfolioForm onSubmit={createPortfolioMutation.mutate} />
              </div>
              <div className="grid gap-4">
                {portfolios?.portfolios.map((portfolio) => (
                  <Card key={portfolio.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{portfolio.title}</h4>
                          <p className="text-sm text-gray-600">{portfolio.description}</p>
                          <div className="flex space-x-2 mt-2">
                            <Badge variant="outline">{portfolio.category}</Badge>
                            <Badge variant="outline">{portfolio.clientName}</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <PortfolioForm 
                            portfolio={portfolio} 
                            onSubmit={(data) => updatePortfolioMutation.mutate({ ...data, id: portfolio.id })}
                            isEdit
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePortfolioMutation.mutate(portfolio.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Pricing</h3>
                <PricingForm onSubmit={createPricingMutation.mutate} />
              </div>
              <div className="grid gap-4">
                {pricing?.packages.map((pkg) => (
                  <Card key={pkg.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{pkg.name}</h4>
                          <p className="text-sm text-gray-600">{pkg.priceRange}</p>
                          <div className="flex space-x-2 mt-2">
                            <Badge variant="outline">{pkg.category}</Badge>
                            {pkg.isPopular && <Badge>Popular</Badge>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <PricingForm 
                            pricing={pkg} 
                            onSubmit={(data) => updatePricingMutation.mutate({ ...data, id: pkg.id })}
                            isEdit
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePricingMutation.mutate(pkg.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Testimonials</h3>
                <TestimonialForm onSubmit={createTestimonialMutation.mutate} />
              </div>
              <div className="grid gap-4">
                {testimonials?.testimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{testimonial.clientName}</h4>
                          <p className="text-sm text-gray-600">{testimonial.company}</p>
                          <p className="text-sm mt-2">"{testimonial.comment}"</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <Badge variant="outline">{testimonial.projectType}</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <TestimonialForm 
                            testimonial={testimonial} 
                            onSubmit={(data) => updateTestimonialMutation.mutate({ ...data, id: testimonial.id })}
                            isEdit
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTestimonialMutation.mutate(testimonial.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <h3 className="text-lg font-semibold">Contact Submissions</h3>
              <div className="grid gap-4">
                {contacts?.submissions.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.email} | {contact.phone}</p>
                          <p className="text-sm mt-2">Service: {contact.serviceType}</p>
                          <p className="text-sm mt-1">"{contact.message}"</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(contact.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={contact.status}
                            onValueChange={(status) => updateContactStatusMutation.mutate({ id: contact.id, status })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Form Components
function ServiceForm({ service, onSubmit, isEdit = false }: any) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    category: service?.category || 'advertising',
    icon: service?.icon || 'Settings',
    features: service?.features || [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
    if (!isEdit) {
      setFormData({ name: '', description: '', category: 'advertising', icon: 'Settings', features: [''] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={isEdit ? "outline" : "default"}>
          {isEdit ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {isEdit ? '' : 'Add Service'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advertising">Advertising</SelectItem>
                <SelectItem value="building">Building</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Features</Label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex space-x-2 mt-2">
                <Input
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...formData.features];
                    newFeatures[index] = e.target.value;
                    setFormData({ ...formData, features: newFeatures });
                  }}
                  placeholder="Feature"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFeatures = formData.features.filter((_, i) => i !== index);
                    setFormData({ ...formData, features: newFeatures });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>
          <Button type="submit" className="w-full">
            {isEdit ? 'Update' : 'Create'} Service
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PortfolioForm({ portfolio, onSubmit, isEdit = false }: any) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: portfolio?.title || '',
    description: portfolio?.description || '',
    category: portfolio?.category || 'advertising',
    imageUrl: portfolio?.imageUrl || '',
    clientName: portfolio?.clientName || '',
    completionDate: portfolio?.completionDate || '',
    location: portfolio?.location || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
    if (!isEdit) {
      setFormData({ title: '', description: '', category: 'advertising', imageUrl: '', clientName: '', completionDate: '', location: '' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={isEdit ? "outline" : "default"}>
          {isEdit ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {isEdit ? '' : 'Add Portfolio'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Portfolio' : 'Add New Portfolio'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advertising">Advertising</SelectItem>
                <SelectItem value="building">Building</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="completionDate">Completion Date</Label>
            <Input
              id="completionDate"
              type="date"
              value={formData.completionDate}
              onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isEdit ? 'Update' : 'Create'} Portfolio
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PricingForm({ pricing, onSubmit, isEdit = false }: any) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: pricing?.name || '',
    category: pricing?.category || 'advertising',
    priceRange: pricing?.priceRange || '',
    features: pricing?.features || [''],
    isPopular: pricing?.isPopular || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
    if (!isEdit) {
      setFormData({ name: '', category: 'advertising', priceRange: '', features: [''], isPopular: false });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={isEdit ? "outline" : "default"}>
          {isEdit ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {isEdit ? '' : 'Add Pricing'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Pricing' : 'Add New Pricing'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advertising">Advertising</SelectItem>
                <SelectItem value="building">Building</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priceRange">Price Range</Label>
            <Input
              id="priceRange"
              value={formData.priceRange}
              onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Features</Label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex space-x-2 mt-2">
                <Input
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...formData.features];
                    newFeatures[index] = e.target.value;
                    setFormData({ ...formData, features: newFeatures });
                  }}
                  placeholder="Feature"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFeatures = formData.features.filter((_, i) => i !== index);
                    setFormData({ ...formData, features: newFeatures });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPopular"
              checked={formData.isPopular}
              onCheckedChange={(checked) => setFormData({ ...formData, isPopular: !!checked })}
            />
            <Label htmlFor="isPopular">Popular Package</Label>
          </div>
          <Button type="submit" className="w-full">
            {isEdit ? 'Update' : 'Create'} Pricing
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TestimonialForm({ testimonial, onSubmit, isEdit = false }: any) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: testimonial?.clientName || '',
    company: testimonial?.company || '',
    rating: testimonial?.rating || 5,
    comment: testimonial?.comment || '',
    projectType: testimonial?.projectType || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
    if (!isEdit) {
      setFormData({ clientName: '', company: '', rating: 5, comment: '', projectType: '' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={isEdit ? "outline" : "default"}>
          {isEdit ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {isEdit ? '' : 'Add Testimonial'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="projectType">Project Type</Label>
            <Input
              id="projectType"
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isEdit ? 'Update' : 'Create'} Testimonial
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
