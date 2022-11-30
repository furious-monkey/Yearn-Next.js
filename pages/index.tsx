import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useClientEffect} from '@yearn-finance/web-lib/hooks';
import LogoYearn from '@common/icons/LogoYearn';
import LogoYearnBlue from '@common/icons/LogoYearnBlue';
import {YCRV_TOKEN_ADDRESS} from '@common/utils/constants';

import type {ReactElement} from 'react';

const	apps = [
	{
		href: '/vaults',
		title: 'Vaults',
		description: 'deposit tokens and recieve yield.',
		icon: <LogoYearnBlue className={'h-[100px] w-[100px]'} />
	}, {
		href: '/ycrv',
		title: 'yCRV',
		description: 'get the best CRV yields in DeFi.',
		icon: <Image
			alt={'yCRV'}
			width={100}
			height={100}
			src={`${process.env.BASE_YEARN_ASSETS_URI}/1/${YCRV_TOKEN_ADDRESS}/logo-128.png`}
			loading={'eager'}
			priority />
	}, {
		href: '/veyfi',
		title: 'veYFI',
		description: 'stake your YFI to recieve\nrewards and boost gauges.',
		icon: <LogoYearn className={'h-[100px] w-[100px]'} />
	}, {
		href: '/ybribe',
		title: 'yBribe',
		description: 'Sell votes, or buy them.\nJust like democracy.',
		icon: <LogoYearn className={'h-[100px] w-[100px]'} />
	}
];

function	AppBox({app}: {app: typeof apps[0]}): ReactElement {
	useClientEffect((): void => {
		const featuresEl = document.getElementById(app.href);
		if (featuresEl) {
			const	cleanup = (): void => {
				featuresEl.removeEventListener('pointermove', pointermove);
				featuresEl.removeEventListener('pointerleave', pointerleave);
			};

			const	pointermove = (ev: any): void => {
				const rect = featuresEl.getBoundingClientRect();
				if (featuresEl?.style) {
					featuresEl.style.setProperty('--opacity', '0.3');
					featuresEl.style.setProperty('--x', (ev.clientX - rect.left).toString());
					featuresEl.style.setProperty('--y', (ev.clientY - rect.top).toString());
				}
			};

			const	pointerleave = (): void => {
				if (featuresEl?.style) {
					featuresEl.style.setProperty('--opacity', '0');
				}
			};

			featuresEl.addEventListener('pointermove', pointermove);
			featuresEl.addEventListener('pointerleave', pointerleave);
			return cleanup as any;
		}
	}, []);

	return (
		<Link
			key={app.href}
			href={app.href}>
			<div id={app.href} className={'appBox'}>
				<div>
					{app.icon}
				</div>
				<div className={'pt-6 text-center'}>
					<b className={'text-lg'}>{app.title}</b>
					<p className={'whitespace-pre'}>{app.description}</p>
				</div>
			</div>
		</Link>
	);
}

function	Index(): ReactElement {
	return (
		<>
			<div className={'mx-auto mt-20 mb-44 flex w-full max-w-6xl flex-col items-center justify-center'}>
				<div className={'relative h-12 w-[300px] md:h-[104px] md:w-[600px]'}>
					<p className={'wordWrapper'}> 
						<span className={'word'} style={{opacity: 100}}>{'YEARN'}</span>
					</p>
				</div>
				<div className={'mt-8 mb-6'}>
					<p className={'text-center text-lg md:text-2xl'}>{'The yield protocol for digital assets.'}</p>
				</div>
			</div>
			<section className={'grid grid-cols-1 gap-10 md:grid-cols-3'}>
				{apps.map((app): ReactElement => <AppBox key={app.href} app={app} />)}
			</section>
		</>
	);
}

export default Index;