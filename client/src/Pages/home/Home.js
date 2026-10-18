import React, { useState } from 'react';
import './Home.css';
import Sidebar from '../../Components/Navigation/Sidebar';
import TopNav from '../../Components/Navigation/TopNav';
import BottomNav from '../../Components/Navigation/BottomNav';
import PostSide from '../../Components/PostSide/PostSide';
import RightSide from '../../Components/RightSide/RightSide';
import CreatePostModal from '../../Components/CreatePostModal/CreatePostModal';
import SearchModal from '../../Components/SearchModal/SearchModal';
import ExploreModal from '../../Components/ExploreModal/ExploreModal';

const Home = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [exploreModalOpen, setExploreModalOpen] = useState(false);

  return (
    <div className="Home-page-layout">
      {/* Fixed Left Sidebar (Desktop/Tablet) */}
      <Sidebar
        onOpenCreate={() => setCreateModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenExplore={() => setExploreModalOpen(true)}
      />

      {/* Top Bar for Mobile */}
      <TopNav
        onOpenCreate={() => setCreateModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="Home-feed-container">
        <div className="Home-center-feed">
          <PostSide onOpenCreate={() => setCreateModalOpen(true)} />
        </div>

        {/* Right Suggestions & Trending Panel (Desktop) */}
        <RightSide onOpenSearch={() => setSearchModalOpen(true)} />
      </main>

      {/* Bottom Bar for Mobile */}
      <BottomNav
        onOpenCreate={() => setCreateModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenExplore={() => setExploreModalOpen(true)}
      />

      {/* Modals */}
      <CreatePostModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
      <ExploreModal
        isOpen={exploreModalOpen}
        onClose={() => setExploreModalOpen(false)}
      />
    </div>
  );
};

export default Home;
