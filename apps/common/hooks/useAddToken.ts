// import {useToast} from '@yearn-finance/web-lib/hooks/useToast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

type TWatchAssetOptions = {
    address: string; // The address of the token contract
    symbol: string; // A ticker symbol or shorthand, up to 11 characters
    decimals: number; // The number of token decimals
    image: string; // A string url of the token logo
}

export function useAddToken(): (options: TWatchAssetOptions) => void {
	// const 	toast = useToast();
    
	return (options: TWatchAssetOptions): void => {

		window.ethereum.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20',
				options
			}
		})
			.then((success: boolean): void => {
				if (success) {
					// toast({
					// 	type: 'success',
					// 	content: `${options.symbol} successfully added to wallet`
					// });
				} else {
					// toast({
					// 	type: 'error',
					// 	content: `${options.symbol} failed to be added to wallet`
					// });
				}
			})
			.catch(console.error);
	};
}
