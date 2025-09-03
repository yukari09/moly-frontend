import ContributeForm from "@/components/contribute/ContributeForm";

export const metadata = {
  title: "Contribute | DayCal",
  description: "Help us build the world's most comprehensive guide to cultural celebrations.",
};

export default function ContributePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Share a Celebration with the World</h1>
        <p className="text-lg text-muted-foreground">
          Our mission is to connect people through culture, and we can't do it without you. If you know of a festival not yet on DayCal, or have a story to share, please use the form below. We review every submission.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <ContributeForm />
      </div>
    </div>
  );
}