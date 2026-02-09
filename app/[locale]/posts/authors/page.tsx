import { getAllAuthors } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Authors",
  description: "Browse all authors of our blog posts",
  alternates: {
    canonical: "/posts/authors",
  },
};

export default async function Page() {
  let authors: any[] = [];

  try {
    authors = await getAllAuthors();
  } catch (error) {
    console.error("Failed to fetch authors:", error);
    // Return empty array on error
  }

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>All Authors</h2>
          {authors.length > 0 ? (
            <ul className="grid">
              {authors.map((author: any) => (
                <li key={author.id}>
                  <Link href={`/posts/?author=${author.id}`}>{author.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No authors available at this time.</p>
          )}
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
