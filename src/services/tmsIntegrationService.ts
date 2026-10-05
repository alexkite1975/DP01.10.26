/**
 * Drive Partners 2.0 & ReliefHGV - TMS & ERP Connector Service
 * Provides pre-built bi-directional connectors for SAP S/4HANA,
 * Oracle Transportation Management (OTM), and Mandata Enterprise.
 */

export type TmsProvider = 'SAP_S4HANA' | 'ORACLE_OTM' | 'MANDATA_ENTERPRISE';

export interface TmsConnectorConfig {
  id: string;
  provider: TmsProvider;
  name: string;
  endpointUrl: string;
  status: 'CONNECTED' | 'SYNCING' | 'ERROR' | 'STANDBY';
  lastSyncTimestamp: string;
  pendingInboundLoads: number;
  syncedOutboundEpods: number;
  syncFrequencyMinutes: number;
  activeCompany: string;
  authMethod: 'OAUTH2_CLIENT_CREDENTIALS' | 'API_KEY' | 'MTLS';
}

export const INITIAL_TMS_CONNECTORS: TmsConnectorConfig[] = [
  {
    id: 'tms-sap',
    provider: 'SAP_S4HANA',
    name: 'SAP S/4HANA Logistics Hub',
    endpointUrl: 'https://api.gateway.sap.corp/logistics/v2/freight-orders',
    status: 'CONNECTED',
    lastSyncTimestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    pendingInboundLoads: 4,
    syncedOutboundEpods: 48,
    syncFrequencyMinutes: 5,
    activeCompany: 'Enterprise Logistics Group',
    authMethod: 'OAUTH2_CLIENT_CREDENTIALS'
  },
  {
    id: 'tms-oracle',
    provider: 'ORACLE_OTM',
    name: 'Oracle Transportation Management (OTM)',
    endpointUrl: 'https://otm-cloud.oracle.com/logisticsRestApi/connect',
    status: 'STANDBY',
    lastSyncTimestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    pendingInboundLoads: 0,
    syncedOutboundEpods: 19,
    syncFrequencyMinutes: 15,
    activeCompany: 'ReliefHGV Network UK',
    authMethod: 'OAUTH2_CLIENT_CREDENTIALS'
  },
  {
    id: 'tms-mandata',
    provider: 'MANDATA_ENTERPRISE',
    name: 'Mandata TMS Driver & Manifest Bridge',
    endpointUrl: 'https://api.mandata.co.uk/enterprise/v3/dispatch',
    status: 'CONNECTED',
    lastSyncTimestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    pendingInboundLoads: 12,
    syncedOutboundEpods: 135,
    syncFrequencyMinutes: 2,
    activeCompany: 'UK Haulier Partner Fleet',
    authMethod: 'API_KEY'
  }
];

export async function triggerTmsSync(
  connectorId: string
): Promise<{ success: boolean; message: string; timestamp: string }> {
  // Simulate rapid bi-directional API payload transmission
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Successfully exchanged manifests, e-POD signatures, and demurrage claims.',
        timestamp: new Date().toISOString()
      });
    }, 600);
  });
}
