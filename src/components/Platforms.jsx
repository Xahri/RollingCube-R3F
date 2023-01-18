import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three';
import {Plat} from './Plat'

export let map = new Map();
map.set("000", 1);

export default function Platforms() {

    const positionalDirections = {
        tl: new THREE.Vector3(-60, 0, 0),
        tr: new THREE.Vector3(0, 0, -60),
        bl: new THREE.Vector3(0, 0, 60),
        br: new THREE.Vector3(60, 0, 0),
    }

    function MyShape(props) {
        return (
            <mesh {...props} >
                <Plat />
            </mesh>
        );
    }

    const positioner = useRef()
    let nextPos;
    let tempNextPos;
    const bounds = 400;
    const go = (direction) => {
      
        if (direction === 'r'){
            positioner.current.position.set(0, 0, 0)
            map = new Map();
            map.set("000", 1);
            setShapesOnCanvas([<MyShape key={0} position={[0, 0, 0]} />])
            setTimer(INITIAL_TIMER);
            clearInterval(interval.current);
            setFirstTime(true);
            setKey(1);
            setStartRemovingTime(true);
            setAddTarget(0);
            setRemoveTarget(-0.5);
            setCanRemove(false);
            setStringsArray(["000"]);
            setIdx(0);

            console.log("Reset Platforms.");
        }
        else{
            positioner.current.position.add(positionalDirections[direction])
        }

        // Keep spawning inbounds
        tempNextPos = positioner.current.position
        if ( tempNextPos.length() < bounds ){
            nextPos = tempNextPos;
        }
        else{
            positioner.current.position.sub(positionalDirections[direction])
            tempNextPos = positioner.current.position
            go(Object.keys(positionalDirections)[Math.floor(Math.random()*Object.keys(positionalDirections).length)]);
        }
    }

    useEffect(() => {
        function handleKeyUp(event) {
          if (event.key === 'r') {
            go('r')
          }
        }
    
        window.addEventListener('keyup', handleKeyUp)
    
        return () => {
          window.removeEventListener('keyup', handleKeyUp)
        }
      }, [])

    const [shapesOnCanvas,setShapesOnCanvas] = useState([<MyShape key={0} position={[0, 0, 0]} />])

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    const INITIAL_TIMER = 1; // 0.5
    const [timer, setTimer] = useState(INITIAL_TIMER);
    const interval = useRef();

    const [key, setKey] = useState(1);
    const [firstTime, setFirstTime] = useState(true);

    const [startRemovingTime, setStartRemovingTime] = useState(true);

    const [addTarget, setAddTarget] = useState(0);
    const [removeTarget, setRemoveTarget] = useState(-0.5); // -0.5

    const [canRemove, setCanRemove] = useState(false);

    const [stringsArray, setStringsArray] = useState(["000"]);

    const [idx, setIdx] = useState(0);

    useEffect(() => {
        function handleTimer() {
            interval.current = setInterval(() => {
            setTimer((count) => count - 0.1);
        }, 100);
    }

    if (round(timer, 1) <= removeTarget) {

        setRemoveTarget(removeTarget - 1);

        if (canRemove){
            
            shapesOnCanvas.shift();
            // console.log("Removed!")
        }
        
        if (removeTarget <= -4 && startRemovingTime){
            setCanRemove(true);
            setStartRemovingTime(false);
        }
    }

    if (round(timer, 1) <= addTarget) {

        setAddTarget(addTarget - 1);

        let rndKey = Object.keys(positionalDirections)[Math.floor(Math.random()*Object.keys(positionalDirections).length)];
        go(rndKey);

        setShapesOnCanvas([...shapesOnCanvas, <MyShape key={key} position={nextPos} />])
        setKey(key+1);
        // console.log("Added!")

        if (map.get((nextPos.x).toString() + (nextPos.y).toString() + (nextPos.z).toString()) >= 1){
            map.set((nextPos.x).toString() + (nextPos.y).toString() + (nextPos.z).toString(), map.get((nextPos.x).toString() + (nextPos.y).toString() + (nextPos.z).toString()) + 1);
        }
        else{
            map.set((nextPos.x).toString() + (nextPos.y).toString() + (nextPos.z).toString(), 1);
        }

        setStringsArray([...stringsArray, (nextPos.x).toString() + (nextPos.y).toString() + (nextPos.z).toString()])

        // if (map.size > 2){
        if (stringsArray.length > 1){
            map.set(stringsArray[idx], map.get(stringsArray[idx]) - 1);
            setIdx(idx+1);
        }
    }

    if (timer === INITIAL_TIMER && firstTime) {
        setFirstTime(false);
        handleTimer();
    }

  }, [timer]);
  
    return (
        <>
            <group ref={positioner} ></group>
            <group >
                {[...shapesOnCanvas]}
            </group>
        </>
    )
}