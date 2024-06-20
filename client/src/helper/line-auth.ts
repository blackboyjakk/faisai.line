import liff from "@line/liff";



export const lineLogin = async (): Promise<boolean> => {
    const isLoggedIn = new Promise<boolean>((resolve) => {
        
        
            const isLoggedIn = liff.isLoggedIn()

            if (isLoggedIn) {
                resolve(true);
            } else {
                sessionStorage.tabID = sessionStorage.tabID ?
                    sessionStorage.tabID :
                    sessionStorage.tabID = Math.random();
                console.log(sessionStorage.tabID)

                localStorage.setItem('redirectUri:' + sessionStorage.tabID, window.location.href)
                setTimeout(() => {
                    liff.login();
                }, 1000)
            }
        
    })
    return isLoggedIn
}
const checkTokenExpire = (jwt: string | null) => {
    if (jwt == null) return true;
    const jwtPayload = JSON.parse(window.atob(jwt.split('.')[1]))
    const isExpired = Date.now() >= jwtPayload.exp * 1000;
    return isExpired;
}