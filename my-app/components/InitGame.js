"use client";
import { useRef, useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { nextStep } from "../components/features/gameSlice";

export default function InitGame() {
    const container = useRef();
    const dispatch = useDispatch();
    const state = useSelector((state) => state.initGame.gameState);
    const [GameSnake, setGameSnake] = useState(null);
  
    const stateObj = useMemo(() => {
      return {
        initialization() {
          let renderer = GameSnake.webGLRenderer();
          container.current.appendChild(renderer.domElement);
        },
      };
    }, [GameSnake]);
  
    useEffect(() => {
      let isUnmounted = false;
      (async () => {
        const { default: GameSnake } = await import(
          "../controllers/snake/GameSnake"
        );
  
        if (isUnmounted) return;
        let cube = GameSnake.instance;
        setGameSnake(cube);
      })();
  
      return () => {
        isUnmounted = true;
      };
    }, []);
  
    useEffect(() => {
      if (!GameSnake) return;
      let isUnmountedSec = false;
      (async () => {
        await GameSnake[`${state}Action`]?.();
        if (isUnmountedSec) return;
        dispatch(nextStep());
      })();
  
      stateObj[state]?.();
  
      return () => {
        isUnmountedSec = true;
      };
    }, [state, GameSnake]);
  
    return <div className="snake-game" ref={container}></div>;
}
