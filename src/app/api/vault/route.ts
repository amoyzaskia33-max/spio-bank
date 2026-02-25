/**
 * GET /api/vault
 * Returns all vault components discovered from src/vault-data/ folder
 */

import { NextResponse } from 'next/server';
import { scanVault, getVaultStats, type VaultComponent } from '@/lib/vault-scanner';

export async function GET() {
  try {
    const components = scanVault();
    const stats = getVaultStats();
    
    return NextResponse.json({
      success: true,
      data: components,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error scanning vault:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to scan vault',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
