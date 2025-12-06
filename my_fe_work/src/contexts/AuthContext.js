/**
 * AuthContext 생성
 * 
 * React의 createContext를 사용하여 인증 관련 컨텍스트를 생성합니다.
 * 초기값은 null로 설정합니다.
 * 
 * ## Context란?
 * 
 * React Context는 컴포넌트 트리 전체에 데이터를 전달하는 방법입니다.
 * props drilling(여러 컴포넌트를 거쳐 props를 전달하는 것)을 피할 수 있습니다.
 * 
 * ## 구조 설명
 * 
 * ```
 * AuthContext (이 파일)
 *   ↓ createContext로 생성
 *   ↓
 * AuthProvider (AuthProvider.jsx)
 *   ↓ Provider로 감싸서 상태 제공
 *   ↓
 * useAuth (useAuth.js)
 *   ↓ useContext로 값 가져오기
 *   ↓
 * 컴포넌트들 (Login.jsx, Home.jsx 등)
 * ```
 * 
 * ## 사용 흐름
 * 
 * 1. **AuthContext 생성** (이 파일)
 *    - `createContext(null)`로 빈 컨텍스트 생성
 * 
 * 2. **AuthProvider에서 상태 제공**
 *    - `<AuthContext.Provider value={...}>`로 상태와 함수 제공
 * 
 * 3. **컴포넌트에서 사용**
 *    - `useAuth()` 훅을 통해 상태와 함수 접근
 * 
 * ## 왜 초기값이 null인가?
 * 
 * - AuthProvider가 제공하는 값이 없을 때를 구분하기 위함
 * - useAuth에서 null 체크를 통해 에러를 발생시킬 수 있음
 */
import { createContext } from 'react'

export const AuthContext = createContext(null)

