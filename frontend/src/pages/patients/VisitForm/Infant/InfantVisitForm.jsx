import { Card, CardContent, CardHeader, CardTitle, Alert, AlertDescription } from "@/components/ui";
import React from 'react';
import { Construction } from "lucide-react";

function InfantVisitForm() {
  return (
    <div className="space-y-6">
      <Alert>
        <Construction className="h-4 w-4" />
        <AlertDescription>
          Infant Visit Form is under development. This feature will be available soon.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Infant Visit Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            The Infant Visit Form will include specialized medical examination, 
            vaccination tracking, feeding assessment, and growth monitoring 
            specifically designed for infant patients.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default InfantVisitForm;

