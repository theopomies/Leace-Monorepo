import Script from "next/script";

export const StripePricingTable = ({ userId }: { userId: string }) => {
  return (
    <>
      <Script async src="https://js.stripe.com/v3/pricing-table.js"></Script>
      <stripe-pricing-table
        pricing-table-id="prctbl_1MW5AVChNGYmKUwv92oc1cIJ"
        publishable-key="pk_test_51MW4eUChNGYmKUwvrzku5ORxQsj2I0czUzuIzCgFKQyWmS3tCDeeOKJzqvDaMVViOgehcDWCg4Nd9k90FjNEwlJ800McMK6MO6"
        client-reference-id={userId}
      ></stripe-pricing-table>
    </>
  );
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
