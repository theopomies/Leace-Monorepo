export interface UserLayoutProps {
  sidePanel: React.ReactNode;
  mainPanel: React.ReactNode;
}

export function UserLayout({ sidePanel, mainPanel }: UserLayoutProps) {
  return (
    <div className="flex-grow overflow-auto rounded-lg bg-white px-12 py-20">
      <div className="flex gap-12">
        <div className="flex flex-col items-center gap-12 px-16">
          {sidePanel}
        </div>
        {mainPanel}
      </div>
    </div>
  );
}
