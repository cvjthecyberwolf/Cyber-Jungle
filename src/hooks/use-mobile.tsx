import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    checkDevice()

    window.addEventListener("resize", checkDevice)

    // Cleanup listener
    return () => {
      window.removeEventListener("resize", checkDevice)
    }
  }, [])

  return isMobile
}
