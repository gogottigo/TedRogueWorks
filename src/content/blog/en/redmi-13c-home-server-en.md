---
title: "How to Turn an Old Phone into a Home Server: Music, Files, and Torrents"
description: "A practical guide to setting up Termux, Navidrome, and Tailscale on an old Android phone."
pubDate: 2026-10-12
draft: false
lang: en
translationKey: redmi-home-server
slug: redmi-13c-home-server
tags:
  - Linux
  - Android
  - Self-hosting
---
# How to Turn an Old Phone into a Home Server: Music, Files, and Torrents

After buying a new phone, my old Redmi 13C spent a long time gathering dust. Then, perhaps caught up in the latest trends, I got the idea of buying a dedicated MP3 player with a 3.5 mm headphone jack and Bluetooth. But after seeing the prices, I changed my mind. That's when I remembered the Redmi sitting unused in a drawer.

At first, I wanted to turn it into a fully offline MP3 player with old-school console emulators. Then I remembered just how bulky the thing was. So I came up with another idea: get root access and turn the phone into a playground for experiments.

That plan hit its first snag. Apparently, unlocking the bootloader on Xiaomi phones has become an exercise in jumping through every imaginable hoop. I decided to skip root and turn the phone into my own music and file server instead.

In the end, the old smartphone got a second life. It now runs an SSH server, Navidrome, and qBittorrent, with Tailscale providing remote access. No root access, extra hardware, or VPS rental required.

Here's how I set everything up.

## 1. Preparing the Phone

First, I factory-reset the phone and did a thorough debloat using ADB, removing the preinstalled apps I didn't need.

Next, I reserved a permanent local IP address for the Redmi in my router settings. That way, I don't have to keep looking up a new address for the phone on my home network.

Then I installed Termux, an app that provides a Linux-like environment on Android.

Update the packages:

```bash
pkg update && pkg upgrade
```

Give Termux access to Android's shared storage:

```bash
termux-setup-storage
```

Set a password for future SSH connections:

```bash
passwd
```

Find your Termux username:

```bash
whoami
```

You'll need this username when connecting to the server from your computer.

## 2. File Server over SSH

I decided to use SSH to access the phone's files over the network. This lets me connect to its filesystem from a computer and mount it as a network drive.

Install OpenSSH:

```bash
pkg install openssh
```

Start the SSH server:

```bash
sshd
```

By default, the SSH server in Termux listens on port `8022`.

### 2.1. Connecting from Windows

On your Windows computer, install:

- [WinFsp](https://github.com/winfsp/winfsp)
- [SSHFS-Win](https://github.com/winfsp/sshfs-win)

After installing them, open Windows File Explorer and choose **Map network drive**.

Choose a drive letter, such as `X:`, and enter a folder path in this format:

```text
\\sshfs\TERMUX_USERNAME@192.168.0.8!8022\storage\emulated\0
```

Here:

- `TERMUX_USERNAME` is the username you got from `whoami`;
- `192.168.0.8` is an example of the Redmi's local IP address;
- `8022` is the SSH port;
- `storage\emulated\0` is the path to Android's internal storage.

To access the SD card, use the path to its corresponding directory, for example:

```text
\\sshfs\TERMUX_USERNAME@192.168.0.8!8022\storage\5511-263E
```

`5511-263E` is the SD card identifier on my phone. Yours may be different.

Once connected, the phone's internal storage and microSD card appear in Windows File Explorer as network drives.

On Linux, you can use SFTP or SSHFS. Here's an example using SSHFS:

```bash
mkdir -p ~/Redmi
sshfs -p 8022 TERMUX_USERNAME@192.168.0.8:/storage/emulated/0 ~/Redmi
```

Before using this, install SSHFS and make sure Termux has access to the directories you want to mount.

## 3. Starting the SSH Server Automatically

To avoid having to start SSH manually after every reboot, I installed Termux:Boot. After installing it, you need to open the app manually at least once.

Create a directory for startup scripts:

```bash
mkdir -p ~/.termux/boot
```

Create the script:

```bash
nano ~/.termux/boot/start-sshd
```

Add the following:

```bash
#!/data/data/com.termux/files/usr/bin/bash

termux-wake-lock

# Start SSH
if ! pgrep -x sshd >/dev/null 2>&1; then
    sshd
fi
```

Save the file and make it executable:

```bash
chmod +x ~/.termux/boot/start-sshd
```

`termux-wake-lock` helps prevent the processor from going to sleep while Android allows the app to run. It is not an absolute guarantee of 24/7 uptime: Android's battery optimization and background-process restrictions still matter.

## 4. A Music Server with Navidrome

A file server wasn't enough for me. I wanted something more like Spotify: an organized music library with album art and search, plus the ability to listen to my music outside the home.

I chose [Navidrome](https://www.navidrome.org/), a lightweight music server with a web interface and support for the Subsonic API.

Install Navidrome and ffmpeg in Termux:

```bash
pkg install navidrome ffmpeg
```

### 4.1. Organizing the Music Library

My music is stored in two places: internal storage and the microSD card. To make Navidrome treat them as one library, create a shared directory:

```bash
mkdir -p ~/MusicLibrary
```

Add symbolic links to the existing music folders:

```bash
ln -s /storage/emulated/0/Music \
  ~/MusicLibrary/Internal

ln -s /storage/5511-263E/Music \
  ~/MusicLibrary/SDCard
```

The files aren't copied anywhere. The links simply point to the existing directories.

### 4.2. Configuring Navidrome

Create a configuration file:

```bash
nano ~/navidrome.toml
```

Add the following:

```toml
MusicFolder = "/data/data/com.termux/files/home/MusicLibrary"
DataFolder = "/data/data/com.termux/files/home/navidrome-data"
Address = "0.0.0.0"
Port = "4533"
Scanner.FollowSymlinks = true
```

Here's what the settings mean:

- `MusicFolder` is the root directory of the music library.
- `DataFolder` is where Navidrome stores its database and other data.
- `Address = "0.0.0.0"` makes the server listen on the available network interfaces.
- `Port = "4533"` is the port used by the web interface and API.
- `Scanner.FollowSymlinks = true` allows the scanner to follow symbolic links.

That last setting is especially important because the music is stored in multiple directories.

### 4.3. Starting the Server

Run:

```bash
navidrome --configfile "$HOME/navidrome.toml"
```

Once the server starts, its web interface is available on your home network at:

```text
http://192.168.0.8:4533
```

Replace `192.168.0.8` with your own IP address.

When you open the interface for the first time, create an administrator account.

### 4.4. Listening to Your Music

On a computer, you can open the Navidrome web interface and listen to music directly in your browser.

On my phone, I use Symfonium. If you'd prefer a free and open-source alternative, you can try Navic.

In the app, select a Subsonic-compatible server and enter your Navidrome address, port, username, and password.

You now have your own music library, complete with search, albums, artists, and playlists. Your music stays on your phone instead of being uploaded to a third-party cloud service.

### 4.5. What About Automatic Scanning?

Navidrome can detect changes in your music library, but the scanner's behavior depends on the configuration and how files are changed.

In particular, changes on an SD card accessed through symbolic links may not be detected immediately. If new tracks don't appear in the library, check the scanning settings and run a scan manually if necessary.

The installed version of Navidrome supports this command:

```bash
navidrome scan --help
```

To perform a full scan of all subdirectories using the existing configuration:

```bash
navidrome scan --configfile "$HOME/navidrome.toml" --full
```

The `--full` option makes the scanner check every subdirectory, ignoring file modification timestamps.

## 5. Remote Access with Tailscale

The music server works at home, but I also wanted to listen to my music when I was away.

I could have configured port forwarding on my router, but that would have required extra setup and exposed the service through a public address.

Instead, I chose [Tailscale](https://tailscale.com/).

Tailscale creates a private network between your devices. Each device gets its own address in the `100.x.x.x` range and can connect to other devices on that network.

### 5.1. Setting Up Tailscale

Install Tailscale on the Redmi 13C and your main phone. Sign both devices into the same Tailscale network and approve the VPN connection.

Both devices should then appear in the Tailscale admin console.

### 5.2. Connecting to Navidrome

You can now connect in two ways.

**At home, over Wi-Fi:**

```text
http://192.168.0.8:4533
```

**Away from home, over Tailscale:**

```text
http://100.x.x.x:4533
```

Replace `100.x.x.x` with the Redmi 13C's actual Tailscale IP address.

For remote access, Tailscale must be active on the client device, and Navidrome must be running on the server. Tailscale itself won't restart apps that Android has stopped.

You also don't need to expose port `4533` to the entire internet through your router.

## 6. Starting Navidrome Automatically

To avoid starting Navidrome manually after every reboot, add it to the startup script you already created.

Open the file:

```bash
nano ~/.termux/boot/start-sshd
```

Add this block at the end:

```bash
# Start Navidrome
if ! pgrep -f 'navidrome.*navidrome.toml' >/dev/null 2>&1; then
    nohup "$PREFIX/bin/navidrome" \
        --configfile "$HOME/navidrome.toml" \
        >> "$HOME/navidrome.log" 2>&1 &
fi
```

Save the file and check its permissions:

```bash
chmod +x ~/.termux/boot/start-sshd
```

The script will now start both SSH and Navidrome when Termux:Boot runs.

## 7. Adding a Torrent Server with qBittorrent

At this point, the Redmi was already working as a music and file server. But since the phone stays connected to the network, why not use it for downloads as well?

For that, I installed `qbittorrent-nox`, a version of qBittorrent without a graphical window that you can control through a web browser.

### 7.1. Installing qBittorrent

In Termux, enable the X11 repository:

```bash
pkg install x11-repo
pkg update
```

Install qBittorrent:

```bash
pkg install qbittorrent-nox
```

### 7.2. Starting the Web Interface

Run:

```bash
qbittorrent-nox --webui-port=8080
```

On the first launch, the program displays information about the web interface and a temporary administrator password. Make sure to save it.

Once it starts, open a browser on your computer:

```text
http://192.168.0.8:8080
```

Log in with the username `admin` and the temporary password. After logging in, set a permanent password in the Web UI settings.

You can now add magnet links and `.torrent` files, monitor download progress, manage the queue, and limit download and upload speeds.

All of this is controlled from your computer, while the actual downloads run on the Redmi.

### 7.3. Configuring the Download Folder

On my phone, the SD card is mounted at:

```text
/storage/5511-263E
```

I use this directory to save files:

```text
/storage/5511-263E/Download
```

In qBittorrent's `Downloads` settings, set this as the default save path.

You can create a separate directory for incomplete downloads:

```bash
mkdir -p /storage/5511-263E/Download/Torrents/incomplete
```

Then select it in qBittorrent's settings.

Make sure Termux has permission to access Android's shared storage and that the selected directory is writable.

### 7.4. Running qBittorrent in the Background

To keep qBittorrent running after you close the SSH session, launch it in the background:

```bash
nohup qbittorrent-nox --webui-port=8080 \
    > "$HOME/qbittorrent.log" 2>&1 < /dev/null &
```

Check that the process is running:

```bash
pgrep -af qbittorrent
```

To inspect the log, run:

```bash
tail -n 30 ~/qbittorrent.log
```

You can now close the SSH session and continue managing downloads through the web interface.

### 7.5. Adding qBittorrent to Startup

I already had a `~/.termux/boot/start-sshd` script that starts SSH and Navidrome, so I added one more block:

```bash
# Start qBittorrent
if ! pgrep -f 'qbittorrent-nox.*--webui-port=8080' >/dev/null 2>&1; then
    nohup "$PREFIX/bin/qbittorrent-nox" --webui-port=8080 \
        >> "$HOME/qbittorrent.log" 2>&1 < /dev/null &
fi
```

Now one script starts all three services:

- **SSH** — access to files and the command line;
- **Navidrome** — the music library;
- **qBittorrent** — torrent downloads.

Before rebooting, it's a good idea to check the script's syntax:

```bash
bash -n ~/.termux/boot/start-sshd
```

If the command produces no output, no syntax errors were found.

For startup to work after a reboot, Termux:Boot must be installed and opened manually at least once.

**Important:** qBittorrent's web interface provides control over your downloads, so don't expose port `8080` directly to the internet. For remote management, use Tailscale and a strong password.

## 8. The Result

The old Redmi 13C has turned into a small home server.

Here's what I have now:

- **File server:** internal storage and microSD are accessible over SSH/SFTP and can be mounted as network drives.
- **Music server:** Navidrome combines music from two locations into a single library.
- **Music clients:** Navic and Symfonium let me listen to my own music from my main phone.
- **Torrent server:** qBittorrent-nox downloads files to the SD card and is controlled through a browser.
- **Remote access:** Tailscale lets me reach the services away from home without forwarding ports on the router.
- **Automatic startup:** Termux:Boot starts SSH, Navidrome, and qBittorrent after Android boots.

Everything runs on a phone I already owned — no root access, rented server, or extra hardware required.

Of course, the Redmi 13C won't replace a proper NAS or Linux server. Android imposes limitations on background processes, storage access, and automatic startup. But for personal use, the phone has more than enough power.

In the end, a phone that might otherwise have spent years gathering dust has become a useful part of my home infrastructure.
