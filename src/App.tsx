import { HomePageContent } from './components/HomePageContent';
import { PageLayout } from './components/PageLayout';

function App() {
  return (
    <PageLayout navOnDark>
      <HomePageContent />
    </PageLayout>
  );
}

export default App;
