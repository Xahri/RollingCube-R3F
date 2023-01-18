import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from "@react-three/drei";
import { useState } from 'react'

import Player from "./components/Player";
import Platforms from './components/Platforms';
import { Overlay } from './components/Overlay';
import MyModal from './components/MyModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="bg" />
      <Overlay />
      {isModalOpen ? (
        <MyModal setIsModalOpen={setIsModalOpen} />
      ) : (
        <div>
          <div className="bg" />
          <Canvas dpr={[1, 2]} camera={{ position: [500, 500, 500], near: 1, far: 4000 }} orthographic={ true } >
            <Platforms />
            <Player />
            <OrbitControls />
          </Canvas>
          <Stats />
          <Overlay />
        </div>
      )}
    </div>
  );
}