/**
 * AuthContext 생성
 * 
 * React의 createContext를 사용하여 인증 관련 컨텍스트를 생성합니다.
 * 초기값은 null로 설정합니다.
 */
import { createContext } from 'react'

export const AuthContext = createContext(null)

