import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, RefreshCw, CheckCircle, Clock, Phone, Mail, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export default function AdminPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contactData, isLoading, refetch } = useQuery({
    queryKey: ['contact-submissions', selectedStatus],
    queryFn: () => backend.company.getContactSubmissions({ 
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      limit: 50 
    }),
    enabled: isVisible,
  });

  const { data: dbInfo } = useQuery({
    queryKey: ['db-info'],
    queryFn: () => backend.company.getDatabaseInfo(),
    enabled: isVisible,
  });

  const { data: inspectData } = useQuery({
    queryKey: ['inspect-data'],
    queryFn: () => backend.company.inspectData({ limit: 5 }),
    enabled: isVisible,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      backend.company.updateContactStatus({ id, status }),
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Contact submission status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update contact submission status.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      contacted: { color: 'bg-blue-100 text-blue-800', icon: Phone },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <IconComponent className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white shadow-lg"
          size="sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel - Database Monitor</h2>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Hide
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Contact Submissions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Contact Submissions</h3>
                <div className="flex items-center space-x-2">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => refetch()} size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="text-sm text-gray-600 mb-4">
                    Total submissions: {contactData?.total || 0}
                  </div>
                  
                  {contactData?.submissions.map((submission) => (
                    <Card key={submission.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{submission.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{submission.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{submission.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {getStatusBadge(submission.status)}
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(submission.createdAt).toLocaleDateString('id-ID')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">Service Type:</div>
                          <Badge variant="outline">{submission.serviceType}</Badge>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">Message:</div>
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {submission.message}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Select
                            value={submission.status}
                            onValueChange={(status) => updateStatusMutation.mutate({ id: submission.id, status })}
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
                      </CardContent>
                    </Card>
                  ))}
                  
                  {contactData?.submissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No contact submissions found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Database Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Database Information</h3>
              
              {dbInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Database Tables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {dbInfo.tables.map((table) => (
                        <Badge key={table} variant="outline" className="mr-2 mb-2">
                          {table}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded text-xs font-mono break-all">
                      <strong>Connection String:</strong><br />
                      {dbInfo.connectionString}
                    </div>
                  </CardContent>
                </Card>
              )}

              {inspectData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Table Data Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {inspectData.tables.map((table) => (
                        <div key={table.tableName} className="border border-gray-200 rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{table.tableName}</h4>
                            <Badge>{table.count} rows</Badge>
                          </div>
                          {table.data.length > 0 && (
                            <div className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                              <pre>{JSON.stringify(table.data[0], null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
