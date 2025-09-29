import { Card, CardContent, CardHeader, CardTitle, Alert, AlertDescription } from "@/components/ui";
import React from 'react';
import { Construction } from "lucide-react";

function ChildVisitForm() {
  return (
    <div className="space-y-6">
      <Alert>
        <Construction className="h-4 w-4" />
        <AlertDescription>
          Child Visit Form is under development. This feature will be available soon.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Child Visit Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            The Child Visit Form will include comprehensive medical examination, 
            treatment history, and drug prescription management specifically 
            designed for child patients.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChildVisitForm;

