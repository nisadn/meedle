// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"

const breakpoints = {
  sm: '40em',
  md: '52em',
  lg: '64em'
}

const shadows = {
  custom: '0px 0px 8px 1px #E2E2E2'
}

const colors = {
  random: {
    '100': '#e2e2e2'
  }
}

// 2. Call `extendTheme` and pass your custom values
const customTheme = extendTheme({
  breakpoints,
  shadows,
  colors,
})

export default customTheme;