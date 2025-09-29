import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Alert, AlertDescription, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Label, Input } from "@/components/ui";
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw,
  Eye,
  Trash2,
  Activity,
  Calendar,
  HardDrive,
  MoreVertical,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import api from "../../../services/api";

const DatabasesTab = ({ 
  databases 
}) => {
  const [databaseStats, setDatabaseStats] = useState({});
  const [loadingStats, setLoadingStats] = useState({});
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch database statistics
  const fetchDatabaseStats = async (dbName, retryCount = 0) => {
    if (databaseStats[dbName] || loadingStats[dbName]) return; // Already loaded or loading
    
    setLoadingStats(prev => ({ ...prev, [dbName]: true }));
    
    try {
      console.log(`Fetching stats for database: ${dbName}`);
      const response = await api.get(`/api/data/database-stats/${dbName}`);
      
      if (response.data.success) {
        console.log(`Successfully loaded stats for ${dbName}:`, response.data.stats);
        setDatabaseStats(prev => ({
          ...prev,
          [dbName]: response.data.stats
        }));
      } else {
        throw new Error(response.data.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error(`Error fetching stats for ${dbName}:`, error);
      
      let errorMessage = 'Failed to load statistics';
      if (error.response?.status === 404) {
        errorMessage = 'Database not found';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Set fallback stats
      setDatabaseStats(prev => ({
        ...prev,
        [dbName]: {
          databaseName: dbName,
          tableCount: 0,
          totalRecords: 0,
          sizeMB: 0,
          error: errorMessage
        }
      }));
    } finally {
      setLoadingStats(prev => ({ ...prev, [dbName]: false }));
    }
  };

  // Load stats for all databases on mount
  useEffect(() => {
    console.log('Loading stats for databases:', databases);
    databases.forEach(db => {
      // Only fetch stats for databases that look like valid ART databases
      if (db.name && (db.name.startsWith('art_') || db.name === 'preart')) {
        console.log(`Fetching stats for database: ${db.name}`);
        fetchDatabaseStats(db.name);
      }
    });
  }, [databases]);

  const handleViewDatabase = (dbName) => {
    setSelectedDatabase(dbName);
    setShowDetails(true);
  };

  const handleDeleteDatabase = (dbName) => {
    // TODO: Implement database deletion
    console.log('Delete database:', dbName);
  };

  const handleRefreshDatabase = (dbName) => {
    // Clear existing stats and refetch
    setDatabaseStats(prev => {
      const newStats = { ...prev };
      delete newStats[dbName];
      return newStats;
    });
    fetchDatabaseStats(dbName);
  };

  const getDatabaseType = (dbName) => {
    if (dbName === 'preart') {
      return { type: 'Main Database', color: 'blue', description: 'Primary aggregated database' };
    } else if (dbName.startsWith('art_')) {
      return { type: 'Site Database', color: 'green', description: 'Site-specific imported data' };
    } else {
      return { type: 'Custom Database', color: 'purple', description: 'User-created database' };
    }
  };

  const getDatabaseStats = (dbName) => {
    const stats = databaseStats[dbName];
    
    if (!stats) {
      // Return loading state
      return {
        tables: loadingStats[dbName] ? '...' : 0,
        records: loadingStats[dbName] ? '...' : 0,
        size: loadingStats[dbName] ? '...' : 0,
        loading: loadingStats[dbName] || false,
        error: stats?.error
      };
    }
    
    return {
      tables: stats.tableCount || 0,
      records: stats.totalRecords || 0,
      size: stats.sizeMB || 0,
      loading: false,
      error: stats.error
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Database className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Database Management</CardTitle>
                <CardDescription>View and manage your imported databases</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDatabaseStats({});
                databases.forEach(db => fetchDatabaseStats(db.name));
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Stats
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Database Summary */}
      {databases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{databases.length}</p>
                  <p className="text-xs text-muted-foreground">Total Databases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {databases.filter(db => db.name === 'preart').length > 0 ? '1' : '0'}
                  </p>
                  <p className="text-xs text-muted-foreground">Main Database</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {databases.filter(db => db.name.startsWith('art_')).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Site Databases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {databases.reduce((total, db) => {
                      const stats = getDatabaseStats(db.name);
                      return total + (typeof stats.records === 'number' ? stats.records : 0);
                    }, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Databases List */}
      {databases.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No databases found</h3>
              <p className="text-muted-foreground mb-4">
                Import SQL files to create new databases
              </p>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Start by importing SQL files from the Import tab to create your first database.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Available Databases</CardTitle>
            <CardDescription>Click on a database to view details and manage it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Database Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {databases.map((db, index) => {
                    const dbType = getDatabaseType(db.name);
                    const stats = getDatabaseStats(db.name);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]" title={db.name}>
                              {db.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <Badge variant="secondary" className={`w-fit bg-${dbType.color}-100 text-${dbType.color}-800`}>
                              {dbType.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground mt-1">
                              {dbType.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {stats.loading ? (
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Loading...</span>
                              </div>
                            ) : stats.error ? (
                              <div className="text-red-500 text-xs">
                                {stats.error}
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center space-x-1">
                                  <span>{stats.tables} tables</span>
                                  {stats.loading && <Loader2 className="h-3 w-3 animate-spin" />}
                                </div>
                                <div>{typeof stats.records === 'number' ? stats.records.toLocaleString() : stats.records} records</div>
                                <div>{typeof stats.size === 'number' ? `${stats.size} MB` : stats.size}</div>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDatabase(db.name)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRefreshDatabase(db.name)}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh Stats
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteDatabase(db.name)}
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

      {/* Database Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Database Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedDatabase}
            </DialogDescription>
          </DialogHeader>
          {selectedDatabase && (() => {
            const stats = databaseStats[selectedDatabase];
            const dbType = getDatabaseType(selectedDatabase);
            
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Database Name</Label>
                    <Input value={selectedDatabase} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input value={dbType.type} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={dbType.description} disabled />
                </div>
                
                {stats ? (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.tableCount}</div>
                        <div className="text-sm text-blue-800">Tables</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.totalRecords.toLocaleString()}</div>
                        <div className="text-sm text-green-800">Records</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{stats.sizeMB} MB</div>
                        <div className="text-sm text-purple-800">Size</div>
                      </div>
                    </div>
                    
                    {stats.tableStats && stats.tableStats.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Table Statistics</h3>
                        <div className="max-h-60 overflow-y-auto border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Table Name</TableHead>
                                <TableHead className="text-right">Records</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.tableStats.slice(0, 20).map((table, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-mono text-sm">{table.tableName}</TableCell>
                                  <TableCell className="text-right">
                                    {table.error ? (
                                      <span className="text-red-500 text-xs">{table.error}</span>
                                    ) : (
                                      table.recordCount.toLocaleString()
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                              {stats.tableStats.length > 20 && (
                                <TableRow>
                                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                                    ... and {stats.tableStats.length - 20} more tables
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center p-8">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading database statistics...</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabasesTab;