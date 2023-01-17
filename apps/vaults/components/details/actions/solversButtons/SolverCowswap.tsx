import React, {useState} from 'react';
import {ethers} from 'ethers';
import {useSolver} from '@vaults/contexts/useSolver';
import {Button} from '@yearn-finance/web-lib/components/Button';
import {useWeb3} from '@yearn-finance/web-lib/contexts/useWeb3';
import {defaultTxStatus, Transaction} from '@yearn-finance/web-lib/utils/web3/transaction';

import type {ReactElement} from 'react';
import type {TDropdownOption, TNormalizedBN} from '@common/types/types';

export type TSolver = {
	isDepositing: boolean,
	amount: TNormalizedBN;
	maxDepositPossible: TNormalizedBN;
	selectedOptionFrom?: TDropdownOption;
	selectedOptionTo?: TDropdownOption;
	onSuccess: VoidFunction;
}
function	SolverCowswap({
	isDepositing,
	amount,
	maxDepositPossible,
	selectedOptionFrom,
	selectedOptionTo,
	onSuccess
}: TSolver): ReactElement {
	console.warn('SolverCowswap');
	const {isActive, provider} = useWeb3();
	const [txStatusApprove, set_txStatusApprove] = useState(defaultTxStatus);
	const [txStatusDeposit, set_txStatusDeposit] = useState(defaultTxStatus);
	const [allowanceFrom, set_allowanceFrom] = useState<TNormalizedBN>();
	const {approve, executeDeposit, executeWithdraw} = useSolver();

	/* 🔵 - Yearn Finance ******************************************************
	** Trigger an approve web3 action, simply trying to approve `amount` tokens
	** to be used by the Partner contract or the final vault, in charge of
	** depositing the tokens.
	** This approve can not be triggered if the wallet is not active
	** (not connected) or if the tx is still pending.
	**************************************************************************/
	async function	onApproveFrom(): Promise<void> {
		if (!selectedOptionFrom || !selectedOptionTo) {
			return;
		}

		new Transaction(provider, approve, set_txStatusApprove)
			.populate()
			.onSuccess(async (): Promise<void> => {
				set_allowanceFrom({
					raw: ethers.constants.MaxUint256,
					normalized: Infinity
				});
			})
			.perform();
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Trigger a deposit web3 action, simply trying to deposit `amount` tokens to
	** the selected vault.
	**************************************************************************/
	async function	onDepositToVault(): Promise<void> {
		if (!selectedOptionTo) {
			return;
		}
		new Transaction(provider, executeDeposit, set_txStatusDeposit)
			.populate()
			.onSuccess(async (): Promise<void> => {
				await onSuccess();
			}).perform();
		
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Trigger a withdraw web3 action using the vault contract to take back
	** some underlying token from this specific vault.
	**************************************************************************/
	async function	onWithdrawShares(): Promise<void> {
		if (!selectedOptionFrom) {
			return;
		}
		new Transaction(provider, executeWithdraw, set_txStatusDeposit)
			.populate()
			.onSuccess(async (): Promise<void> => {
				await onSuccess();
			}).perform();
	}

	/* 🔵 - Yearn Finance ******************************************************
	** Wrapper to decide if we should use the partner contract or not
	**************************************************************************/
	async function	onDepositOrWithdraw(): Promise<void> {
		if (isDepositing) {
			await onDepositToVault();
		} else {
			await onWithdrawShares();
		}
	}

	if (txStatusApprove.pending || amount.raw.gt(allowanceFrom?.raw || 0)) {
		return (
			<Button
				className={'w-full'}
				isBusy={txStatusApprove.pending}
				isDisabled={!isActive || amount.raw.isZero() || (amount.raw).gt(maxDepositPossible.raw)}
				onClick={onApproveFrom}>
				{'Approve'}
			</Button>
		);
	}

	return (
		<Button
			onClick={onDepositOrWithdraw}
			className={'w-full'}
			isBusy={txStatusDeposit.pending}
			isDisabled={!isActive || amount.raw.isZero() || (amount.raw).gt(maxDepositPossible.raw)}>
			{isDepositing ? 'Deposit' : 'Withdraw'}
		</Button>
	);

}

export {SolverCowswap};