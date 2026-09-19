import { Button, PageHeader } from "@/components/ui";

export default function NotFound() {
  return (
    <PageHeader
      eyebrow="Page not found"
      title="We can’t find that one."
      lede="The page may have moved. Try the home page, or head straight to the part most people are looking for."
    >
      <div className="flex flex-wrap gap-4 pt-2">
        <Button href="/" variant="gold" size="lg">
          Back to the home page
        </Button>
        <Button href="/give" variant="ghost" size="lg">
          Ways to give
        </Button>
      </div>
    </PageHeader>
  );
}
