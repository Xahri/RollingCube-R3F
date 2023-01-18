import { useRef, memo, useEffect, useState } from 'react'
import { RoundedBox, Html } from "@react-three/drei"
import * as THREE from 'three';
import { gsap } from "gsap";
import { useFrame } from '@react-three/fiber';
import { map } from './Platforms'
// import { useSpring, animated } from "react-spring";

export default function Player() {

  const rotationalDirections = {
    tl: 0,
    tr: -Math.PI / 2,
    bl: Math.PI / 2,
    br: Math.PI,
  }
  const positionalDirections = {
    tl: new THREE.Vector3(-60, 0, 0),
    tr: new THREE.Vector3(0, 0, -60),
    bl: new THREE.Vector3(0, 0, 60),
    br: new THREE.Vector3(60, 0, 0),
  }

  const Cube = memo(() => {
    const rotationer = useRef()
    const positioner = useRef()

    const [defaultMat] = useState(() => new THREE.TextureLoader().load('/matcap.png'))      // Matcap1
    const [lostMat] = useState(() => new THREE.TextureLoader().load('/P_Matcap1.png'))      // Matcap2
    const [currentMatcap, setCurrentMatcap] = useState(defaultMat);                         // Current Matcap (Default Matcap1)
    const [messedUp, setMessedUp] = useState(false);                                        // Check if player messed up
  
    const go = (direction) => {
      
      if (direction === 'r'){               // Reset
        setMessedUp(false);
        positioner.current.position.set(0, 0, 0)
        console.log("Reset Player.");
      }
      else{
        positioner.current.rotation.y = rotationalDirections[direction]
        positioner.current.position.add(positionalDirections[direction])
      }
  
      gsap.fromTo(
        rotationer.current.rotation,        // Set
        { z: 0 },                           // Starting from
        { z: Math.PI / 2, duration: 0.2 }   // To
        // ease: 'bounce.out'
      )
    }
    
    const checkPlatform = () => {
      if (map.get((positioner.current.position.x).toString() + (positioner.current.position.y).toString() + (positioner.current.position.z).toString()) >= 1) {
        console.log("There're platforms here :)");
        return true;
      } else {
        setMessedUp(true);
        console.log("No platforms here :/");
        return false;
      }
    }

    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => {
      const savedScore = localStorage.getItem("bestScore");
      return savedScore ? parseInt(savedScore) : 0;
    });
  
    useEffect(() => {
      go('r') // Start at the center
  
      function handleKeyUp(event) {
        if (event.key === 'a') {
          if (checkPlatform()) {
            go('tl')
            setScore(prevScore => prevScore + 1);
          }
        }
        if (event.key === 'd') {
          if (checkPlatform()) {
          go('br')
          setScore(prevScore => prevScore + 1);
          }
        }
        if (event.key === 'w') {
          if (checkPlatform()) {
          go('tr')
          setScore(prevScore => prevScore + 1);
          }
        }
        if (event.key === 's') {
          if (checkPlatform()) {
          go('bl')
          setScore(prevScore => prevScore + 1);
          }
        }
        if (event.key === 'r') {
          go('r')
          setScore(0);
          setCurrentMatcap(defaultMat); // set currentMatcap to defaultMat
        }
      }
  
      window.addEventListener('keyup', handleKeyUp)
  
      return () => {
        window.removeEventListener('keyup', handleKeyUp)
      }
    }, [defaultMat])

    var clock = new THREE.Clock();
    let time;
    useFrame(() => {
      if (!checkPlatform()){
        time = clock.getElapsedTime();
        const fallingSpeed = 360;
        if (messedUp){
            positioner.current.position.y = (time * fallingSpeed) * -1
            setCurrentMatcap(lostMat); // set currentMatcap to lostMat
        }

        if (score > bestScore)
          setBestScore(score);
          localStorage.setItem("bestScore", bestScore);
      }
    })
  
    return (
    <group >
      <group ref={positioner}>
        <group ref={rotationer} position={[30, 0, 0]}>
            <RoundedBox args={[60,60,60]} radius={4} smoothness={4} position={[30, 30, 0]} >
                <meshMatcapMaterial matcap={currentMatcap} />
            </RoundedBox>
        </group>
      </group>
      <Html
          transform
          distanceFactor={1200}
          position={[40, 360, 0]}
        >
        <div className="Score" > Score={score}</div>
      </Html>
      <Html
          transform
          distanceFactor={600}
          position={[20, 400, 0]}
        >
        <div className="Score" > Best={bestScore}</div>
      </Html>
    </group>
    )
    
  })

  return (
    <>
      <Cube />
    </>
  )
}