import { HomePageContent } from './components/HomePageContent';
import { PageLayout } from './components/PageLayout';
import { resolveHeroLayoutVariant } from './config/featureFlags';

function App() {
  const heroLayout = resolveHeroLayoutVariant();

  return (
    <PageLayout dark={heroLayout === 'layout-test'}>
      <HomePageContent />
    </PageLayout>
  );
}

export default App;
