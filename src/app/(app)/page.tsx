import { AppHeader } from "@/components/app-header";
import { PageContainer } from "@/components/page-container";

export default function HomePage() {
  return (
    <>
      <AppHeader
        title="Home"
        description="Start building — this page is a blank slate."
      />
      <PageContainer>
        <p className="text-muted-foreground">Nothing here yet.</p>
      </PageContainer>
    </>
  );
}
