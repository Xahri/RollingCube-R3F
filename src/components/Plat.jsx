import { useRef, useState, useEffect } from 'react'
import { RoundedBox } from "@react-three/drei"
import * as THREE from 'three';
import { useSpring, animated} from '@react-spring/three';

export function Plat() {

    const [active, setActive] = useState(0)
    const { scale } = useSpring({ scale: active ? 1 : 0.1 })

    function Shape(props) {
        return (
            <animated.mesh {...props} onClick={() => setActive(Number(!active))} scale={scale} >
                <RoundedBox args={[60,20,60]} radius={4} smoothness={4} position={[0, -10, 0]} dispose={null} >
                    <meshMatcapMaterial matcap={mat} />
                </RoundedBox>
            </animated.mesh>
        );
    }

    const [mat] = useState(() => new THREE.TextureLoader().load('/matcap.png'))

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    const [timer, setTimer] = useState(2);
    const interval = useRef();

    const [firstTime, setFirstTime] = useState(true);

    useEffect(() => {
        function handleTimer() {
            interval.current = setTimeout(() => {
            setTimer((count) => count - 2);
        }, 2000);
    }

    if (round(timer, 1) <= 0) {
        setActive((0))
    }

    if (timer === 2 && firstTime) {
        setFirstTime(false);
        clearTimeout(interval.current);
        handleTimer();
        setActive((1))
    }

  }, [timer, firstTime]);

  useEffect(() => {
    function handleKeyUp(event) {
      if (event.key === 'r') {
        setFirstTime(true);
        setTimer(2);
      }
    }
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  
    return (
        <mesh >
            <Shape />   
        </mesh>  
    )
}