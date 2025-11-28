import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// 개별 도형 컴포넌트
function FloatingShape({ position, shape, color, speed }) {
  const groupRef = useRef()
  
  // 랜덤한 회전 속도
  const rotationSpeed = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const random = () => Math.random()
    return {
      x: (random() - 0.5) * 0.02,
      y: (random() - 0.5) * 0.02,
      z: (random() - 0.5) * 0.02
    }
  }, [])
  
  // 랜덤한 이동 방향 (useRef로 변경 가능하게 관리)
  const directionRef = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const random = () => Math.random()
    return {
      x: (random() - 0.5) * 0.01,
      y: (random() - 0.5) * 0.01,
      z: (random() - 0.5) * 0.01
    }
  }, [])
  
  const directionRefMutable = useRef(directionRef)
  
  // 도형 크기와 선 굵기 계산
  const { baseGeometry, size } = useMemo(() => {
    switch (shape) {
      case 'box':
        return { baseGeometry: new THREE.BoxGeometry(8, 8, 8), size: 8 }
      case 'sphere':
        return { baseGeometry: new THREE.SphereGeometry(6, 8, 8), size: 6 }
      case 'cone':
        return { baseGeometry: new THREE.ConeGeometry(6, 12, 8), size: 9 }
      case 'torus':
        return { baseGeometry: new THREE.TorusGeometry(5, 2, 6, 20), size: 7 }
      case 'octahedron':
        return { baseGeometry: new THREE.OctahedronGeometry(6), size: 6 }
      default:
        return { baseGeometry: new THREE.BoxGeometry(8, 8, 8), size: 8 }
    }
  }, [shape])
  
  // 엣지 지오메트리 생성
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(baseGeometry)
  }, [baseGeometry])
  
  // 선 굵기는 도형 크기에 비례 (최소 3, 최대 8)
  const lineWidth = useMemo(() => {
    return Math.max(3, Math.min(8, size * 1.5))
  }, [size])
  
  useFrame(() => {
    if (groupRef.current) {
      // 회전
      groupRef.current.rotation.x += rotationSpeed.x
      groupRef.current.rotation.y += rotationSpeed.y
      groupRef.current.rotation.z += rotationSpeed.z
      
      // 이동
      groupRef.current.position.x += directionRefMutable.current.x * speed
      groupRef.current.position.y += directionRefMutable.current.y * speed
      groupRef.current.position.z += directionRefMutable.current.z * speed
      
      // 경계 체크 및 반전
      const range = 50
      if (Math.abs(groupRef.current.position.x) > range) {
        directionRefMutable.current.x *= -1
      }
      if (Math.abs(groupRef.current.position.y) > range) {
        directionRefMutable.current.y *= -1
      }
      if (Math.abs(groupRef.current.position.z) > range) {
        directionRefMutable.current.z *= -1
      }
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      {/* 단일 선으로 렌더링 */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial 
          color={color} 
          linewidth={lineWidth}
          transparent
          opacity={0.9}
        />
      </lineSegments>
    </group>
  )
}

// 메인 컴포넌트
function FloatingShapes() {
  // 시스템 테마 감지
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  
  useEffect(() => {
    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      setIsDarkMode(e.matches)
    }
    
    // 이벤트 리스너 추가
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // 구형 브라우저 지원
      mediaQuery.addListener(handleChange)
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])
  
  // 배경색 설정
  const backgroundColor = isDarkMode ? '#1a1a1a' : '#ffffff'
  
  // 랜덤한 도형들 생성
  const shapes = useMemo(() => {
    const shapeTypes = ['box', 'sphere', 'cone', 'torus', 'octahedron']
    // 밝은 색상 계열
    const colors = [
      '#ffffff', '#ffff99', '#99ffff', '#ff99ff', '#99ff99',
      '#ffcc99', '#ccffcc', '#ffcccc', '#ccccff', '#ffffcc',
      '#e6f3ff', '#ffe6f3', '#f3ffe6', '#fff3e6', '#e6fff3',
      '#ffeb3b', '#4fc3f7', '#ba68c8', '#81c784', '#ffb74d'
    ]
    
    // eslint-disable-next-line react-hooks/purity
    const random = () => Math.random()
    
    // 도형 개수를 8~12개로 랜덤 생성
    const count = Math.floor(random() * 5) + 8 // 8~12개
    
    return Array.from({ length: count }, () => ({
      position: [
        (random() - 0.5) * 60,
        (random() - 0.5) * 60,
        (random() - 0.5) * 60
      ],
      shape: shapeTypes[Math.floor(random() * shapeTypes.length)],
      color: colors[Math.floor(random() * colors.length)],
      speed: 0.5 + random() * 0.5
    }))
  }, [])
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      background: backgroundColor
    }}>
      <Canvas 
        camera={{ position: [0, 0, 30], fov: 70 }}
        gl={{ alpha: false }}
        style={{ background: backgroundColor }}
      >
        {/* 배경색 설정 */}
        <color attach="background" args={[backgroundColor]} />
        
        {/* 조명 */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* 도형들 */}
        {shapes.map((shape, index) => (
          <FloatingShape
            key={index}
            position={shape.position}
            shape={shape.shape}
            color={shape.color}
            speed={shape.speed}
          />
        ))}
        
        {/* 카메라 컨트롤 (선택사항) */}
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}

export default FloatingShapes

