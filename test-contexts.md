# Testing Context Detection

## Test on Web (Desktop)
```bash
npx expo start --web
```
Then open http://localhost:8081 in a desktop browser

Expected: Should show DesktopPlaceholder component

## Test on Web (Mobile)
Same as above but:
1. Open browser developer tools
2. Toggle device emulation to mobile
3. Refresh the page

OR visit: http://localhost:8081?context=mobile-web

Expected: Should show "Mobile Email Editor (Coming Soon)" with blue banner at bottom

## Test on Native (Expo Go)
```bash
npx expo start
```
Then:
1. Install Expo Go on your phone
2. Scan the QR code
3. App should open in Expo Go

Expected: Should show "Mobile Email Editor (Coming Soon)" WITHOUT the blue banner

## Test Context Override
Visit these URLs in desktop browser:
- http://localhost:8081?context=desktop - Force desktop view
- http://localhost:8081?context=mobile-web - Force mobile web view
- http://localhost:8081?context=native - Force native view (for testing)