import { resolve } from "dns";
import {app, Notification} from "electron";
import {getAppData, getMainWindow, GL_API_URL, trans, UPDATE_APP_DATA_INTERVAL} from "./appGlobals";
import https from "https";
export let isConnected = false;
let firstConnection = true;


function liveCheck() {
    https.get(GL_API_URL+'/mm/status', (res) => {
        if (res.statusCode === 200) {
            if (isConnected || firstConnection) {
            } else {
                handleReconnection();
            }
            isConnected = true;
            firstConnection = false;
        } else {
            if (isConnected)
                handleDisconnection();
        }
    }).on('error', (err) => {
        console.error(err);
        if (isConnected)
            handleDisconnection();
    });
}

function handleDisconnection() {
    if (isConnected) {
        console.log('Disconnected');
        if (!getAppData() || !getAppData().isLoaded) {
            handleDisconnectionAndQuit();
            return;
        }
        getMainWindow().webContents.send('connection', false);
        // let notification = new Notification({title: trans('Connection lost'), body: trans('Mod Manager will try to reconnect during the next 30 seconds.\n If it fails, it will close.')});
        // notification.show();
    }
    isConnected = false;
}

function handleDisconnectionAndQuit() {
    console.log('Disconnected and quit');
    let notification = new Notification({title: trans('Connection lost'), body: trans('Mod Manager will close.')});
    notification.show();
    app.quit();
    process.exit(0);
}

function handleReconnection() {
    if (isConnected) return;
    console.log('Reconnected');
    getMainWindow().webContents.send('connection', true);
    // let notification = new Notification({title: trans('Connection back'), body: trans('Mod Manager has reconnected.')});
    // notification.show();
}

async function updateAppData() {
    if (!isConnected) return;
    await getAppData().updateAppData();
    getMainWindow().webContents.send('updateAppData', getAppData());
}

export function initializeOnlineCheck() {
    liveCheck();
    setInterval(function() {
        liveCheck();
    }, 5000);
    setInterval(function() {
        console.log('Update app data');
        updateAppData();
    }, UPDATE_APP_DATA_INTERVAL);
}

export function isOnline() {
    liveCheck();
    return isConnected;
}