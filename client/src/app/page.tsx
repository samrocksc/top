"use client";

import Container from "@/components/Container";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import Link from "next/link";

export default function Home() {
  const { theme } = useTheme();
  return (
    <Container theme={theme}>
      <Link href="/lists/new">Create New List</Link>
      <Link href="/lists">View Lists</Link>
      <Button variant="primary">Get Started</Button>
      <Button variant="secondary">Learn More</Button>
    </Container>
  );
}
