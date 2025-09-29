import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Alert, AlertDescription, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";
import React from 'react';
import { 
  FileText, 
  Download, 
  RefreshCw,
  Calendar,
  HardDrive,
  MoreVertical,
  Trash2
} from 'lucide-react';
import api from "../../../services/api";

const FilesTab = ({ 
  exportFiles, 
  showMessage 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'sql':
        return { type: 'SQL', color: 'blue' };
      case 'csv':
        return { type: 'CSV', color: 'green' };
      case 'json':
        return { type: 'JSON', color: 'purple' };
      case 'zip':
        return { type: 'ZIP', color: 'orange' };
      default:
        return { type: 'FILE', color: 'gray' };
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await api.get(`/data/exports/${filename}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showMessage('success', `Downloaded: ${filename}`);
    } catch (error) {
      showMessage('error', 'Download failed: ' + error.message);
    }
  };

  const handleDelete = async (filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        await api.delete(`/data/exports/${filename}`);
        showMessage('success', `Deleted: ${filename}`);
        window.location.reload(); // Simple refresh for now
      } catch (error) {
        showMessage('error', 'Delete failed: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Export Files</CardTitle>
                <CardDescription>Manage and download your exported data files</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Files Summary */}
      {exportFiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{exportFiles.length}</p>
                  <p className="text-xs text-muted-foreground">Total Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {formatFileSize(exportFiles.reduce((total, file) => total + file.size, 0))}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {exportFiles.length > 0 ? new Date(Math.max(...exportFiles.map(f => new Date(f.created)))).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">Latest Export</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Files List */}
      {exportFiles.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No export files available</h3>
              <p className="text-muted-foreground">
                Export some data to see your files here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Export Files</CardTitle>
            <CardDescription>Click download to save files to your computer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportFiles.map((file, index) => {
                    const fileType = getFileType(file.filename);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]" title={file.filename}>
                              {file.filename}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`bg-${fileType.color}-100 text-${fileType.color}-800`}>
                            {fileType.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatFileSize(file.size)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(file.created)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownload(file.filename)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(file.filename)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FilesTab;