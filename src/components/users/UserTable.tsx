import { useState } from "react";
import { motion } from "framer-motion";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Ban, Trash2, CheckCircle } from "lucide-react";
import { User } from "@/types";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, onEdit, onToggleStatus, onDelete }: UserTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
        
        return (
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full bg-${user.colorScheme}-100 flex items-center justify-center text-${user.colorScheme}-600 font-medium`}>{initials}</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-textDark dark:text-white">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-textLight dark:text-gray-400">Member since: {user.memberSince}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-sm">{row.getValue("email")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "Active" ? "success" : "destructive"} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "groups",
      header: "Groups",
      cell: ({ row }) => {
        const groups = row.original.groups || [];
        return (
          <div className="flex flex-wrap gap-1">
            {groups.map((group, index) => (
              <Badge key={index} variant="outline" className={`bg-${group.color}-100 text-${group.color}-600 border-none`}>
                {group.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
              <Edit className="h-4 w-4 text-primary hover:text-blue-700" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onToggleStatus(user)}>
              {user.status === "Active" ? (
                <Ban className="h-4 w-4 text-warning hover:text-yellow-700" />
              ) : (
                <CheckCircle className="h-4 w-4 text-success hover:text-green-700" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(user)}>
              <Trash2 className="h-4 w-4 text-danger hover:text-red-700" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
