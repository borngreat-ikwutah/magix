import { AppLayout } from "~/components/app/app-layout";

export const App = () => {
  return (
    <AppLayout>
      <main className="px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">
            Welcome to Magix
          </h1>
          <div className="grid gap-6">
            <div className="bg-dark-10 border border-grey-08 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Getting Started
              </h2>
              <p className="text-grey-70 mb-4">
                Welcome to your campaign management dashboard. Here you can
                create, manage, and track your campaigns.
              </p>
              <div className="flex gap-4">
                <a
                  href="/app/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Go to Dashboard
                </a>
                <a
                  href="/create-campaigns"
                  className="inline-flex items-center px-4 py-2 bg-grey-08 hover:bg-grey-07 text-white rounded-md transition-colors"
                >
                  Create Campaign
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};
