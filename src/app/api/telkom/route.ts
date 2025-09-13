import { NextRequest, NextResponse } from 'next/server';
import { TelkomDataService } from '../../../components/api/telkom-data-service';
import TelkomScraper from '../../dashboard/utils/telkomScraper';

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'login':
        return handleLogin(data);

      case 'scrape':
        return handleScrape(data);

      case 'refresh':
        return handleRefresh(data);

      case 'getUserData':
        return handleGetUserData(data);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleLogin(data: { email: string; password: string }) {
  const { email, password } = data;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: 'Email and password are required' },
      { status: 400 }
    );
  }

  const user = await TelkomDataService.authenticateUser(email, password);

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user
  });
}

async function handleScrape(data: { username: string; password: string; accountNumber?: string }) {
  const { username, password, accountNumber } = data;

  if (!username || !password) {
    return NextResponse.json(
      { success: false, error: 'Username and password are required' },
      { status: 400 }
    );
  }

  const result = await TelkomScraper.scrapeUserData({
    username,
    password,
    accountNumber
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}

async function handleRefresh(data: { accountNumber: string }) {
  const { accountNumber } = data;

  if (!accountNumber) {
    return NextResponse.json(
      { success: false, error: 'Account number is required' },
      { status: 400 }
    );
  }

  const result = await TelkomScraper.refreshData(accountNumber);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}

async function handleGetUserData(data: { accountNumber: string }) {
  const { accountNumber } = data;

  if (!accountNumber) {
    return NextResponse.json(
      { success: false, error: 'Account number is required' },
      { status: 400 }
    );
  }

  const user = await TelkomDataService.getUserByAccountNumber(accountNumber);
  const scrapedData = await TelkomDataService.getScrapedData(accountNumber);

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    user,
    data: scrapedData
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const accountNumber = searchParams.get('accountNumber');

  if (action === 'status' && accountNumber) {
    try {
      const user = await TelkomDataService.getUserByAccountNumber(accountNumber);
      const scrapedData = await TelkomDataService.getScrapedData(accountNumber);

      return NextResponse.json({
        success: true,
        user: user || null,
        data: scrapedData || null,
        scraperStatus: {
          isAuthenticated: TelkomScraper.isAuthenticated(),
          sessionInfo: TelkomScraper.getSessionInfo()
        }
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to get status' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, error: 'Invalid request' },
    { status: 400 }
  );
}