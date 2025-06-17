#!/bin/bash
set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "▶️  BOOTSTRAP STARTED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ─── Set shell explicitly ────────────────────────────────────────────────
echo "🟡 Step 1: Setting shell to bash"
export SHELL=/bin/bash

# ─── Fix permissions for local pnpm store ────────────────────────────────
echo ""
echo "🟡 Step 2: Fixing permissions for .pnpm-store"
echo "    → Running: sudo chown -R node:node .pnpm-store"
sudo chown -R node:node .pnpm-store

# ─── Setup pnpm (adds export lines to ~/.bashrc) ─────────────────────────
echo ""
echo "🟡 Step 3: Running pnpm setup"
pnpm setup

# ─── Simulate new login session ──────────────────────────────────────────
echo ""
echo "🟡 Step 4: Setting PNPM_HOME and updating PATH"
export PNPM_HOME="$HOME/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
mkdir -p "$PNPM_HOME"
echo "    → PNPM_HOME set to $PNPM_HOME"
echo "    → PATH updated"

# ─── Configure pnpm store location ───────────────────────────────────────
echo ""
echo "🟡 Step 5: Configuring pnpm"
pnpm config set store-dir .pnpm-store
echo "    → Store directory set to .pnpm-store"

# ─── Install global CLI tools ────────────────────────────────────────────
echo ""
echo "🟡 Step 6: Installing global CLI tools"
pnpm add -g eas-cli --allow-build=dtrace-provider
echo "    → eas-cli installed globally"

# ─── Install project dependencies ────────────────────────────────────────
echo ""
echo "🟡 Step 7: Installing project dependencies"
pnpm install
echo "    → Project dependencies installed"

# ─── Run expo-doctor to validate environment ─────────────────────────────
echo ""
echo "🟡 Step 8: Validating environment with expo-doctor"
pnpm exec expo-doctor || true
echo "    → expo-doctor run complete (non-blocking)"

# ─── Load and export EXPO_TOKEN from .env.local ──────────────────────────
echo ""
echo "🟡 Step 9: Loading EXPO_TOKEN from .env.local"
if [[ -f .env.local ]]; then
  EXPO_LINE=$(grep -E '^EXPO_TOKEN=' .env.local | tr -d '\r\n"')
  if [[ -n "$EXPO_LINE" ]]; then
    export ${EXPO_LINE}
    echo "export ${EXPO_LINE}" >> ~/.bashrc
    echo "    → EXPO_TOKEN exported"
    echo "    → EXPO_TOKEN saved to ~/.bashrc"
  else
    echo "    ⚠️  .env.local found but EXPO_TOKEN line is empty"
  fi
else
  echo "    ⚠️  .env.local not found, skipping EXPO_TOKEN setup"
fi

# ─── Done ────────────────────────────────────────────────────────────────
echo ""
echo "✅ BOOTSTRAP COMPLETE - Your environment is ready!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
