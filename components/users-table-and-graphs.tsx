"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersTableAndGraphs() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          console.log("Fetched users:", data);
        } else {
          console.error("Failed to fetch users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTeams(data);
          console.log("Fetched teams:", data);
        } else {
          console.error("Failed to fetch teams:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchUsers();
    fetchTeams();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTeams = teams.filter(
    (team) =>
      (team.name &&
        team.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (team.plan_name &&
        team.plan_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (team.subscription_status &&
        team.subscription_status
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        User and Team Management Dashboard
      </h1>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users and teams..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>

      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <Table>
        <TableCaption>A list of all users in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.name || ""}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(user.updated_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold mt-8 mb-4">Stripe Info</h2>
      <Table>
        <TableCaption>A list of all teams in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Stripe Customer ID</TableHead>
            <TableHead>Stripe Subscription ID</TableHead>
            <TableHead>Stripe Product ID</TableHead>
            <TableHead>Plan Name</TableHead>
            <TableHead>Subscription Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.id}</TableCell>
              <TableCell>{team.name || ""}</TableCell>
              <TableCell>
                {new Date(team.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(team.updated_at).toLocaleString()}
              </TableCell>
              <TableCell>{team.stripe_customer_id}</TableCell>
              <TableCell>{team.stripe_subscription_id}</TableCell>
              <TableCell>{team.stripe_product_id}</TableCell>
              <TableCell>{team.plan_name}</TableCell>
              <TableCell>{team.subscription_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
