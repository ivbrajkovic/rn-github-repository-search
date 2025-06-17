# 🐳 DevContainer + Android Emulator Setup

This guide explains how to run the Expo development server from a **DevContainer (WSL2)** while connecting an **Android emulator** either on the same machine or on another machine in the network.

---

## 📋 Setup Requirements

### Environment Variables

To enable EAS builds without manual login through the console, add an `.env.local` file in the root directory with your Expo token:

```
EXPO_TOKEN=your_expo_token_here
```

The `bootstrap.sh` script will automatically load this token during container initialization. You can get your EXPO_TOKEN from the Expo website under your account settings.

### Port Configuration

- The DevContainer must **publish port 8081**:

```json
"runArgs": ["-p", "8081:8081"]
```

- Expo CLI will often print an unreachable IP like `172.17.0.x` — this **won't work** for the Dev Client.

---

## ✅ If Your Emulator Runs on the **Same PC**

Use Android's built-in alias for host networking:

```bash
adb shell am start -a android.intent.action.VIEW \
  -d "exp+github-repository-search://expo-development-client/?url=http://10.0.2.2:8081"
```

`10.0.2.2` is a hardcoded alias to reach the host from inside the emulator.

---

## 🌐 If the Emulator Runs on Another Machine

1. **Get your host IP address** (on the DevContainer host machine):

   ```powershell
   ipconfig
   ```

   Find the IPv4 under `vEthernet (WSL)` — e.g. `172.28.32.1`

2. **Start Expo inside the DevContainer**:

   ```bash
   pnpm expo start --dev-client --lan
   ```

3. **On the remote machine/emulator**, launch the Dev Client with:

   ```bash
   adb shell am start -a android.intent.action.VIEW \
     -d "exp+github-repository-search://expo-development-client/?url=http://172.28.32.1:8081"
   ```

---

## 🐢 Dev Client Hangs on Logo?

This means it's trying to connect to the wrong IP (e.g. `172.17.x.x`). You can:

- Wait until it times out and reconnects
- Use `adb shell ...` with a good IP (`10.0.2.2` or real LAN IP)

---

## 📄 Helpful Script (on the host)

Add `scripts/open-dev-client.sh` with:

```bash
#!/bin/bash
adb shell am start -a android.intent.action.VIEW \
  -d "exp+github-repository-search://expo-development-client/?url=http://10.0.2.2:8081"
```

Make executable:

```bash
chmod +x scripts/open-dev-client.sh
```

Now you can run:

```bash
./scripts/open-dev-client.sh
```

---

## ✅ Summary

| Emulator Location | Dev Client URL              |
| ----------------- | --------------------------- |
| Same PC           | `http://10.0.2.2:8081`      |
| Another PC/device | `http://<host-lan-ip>:8081` |

---

For more, see the main [README](./README.md).
