<script>
	import TestimonyCard from './ui/TestimonyCard.svelte';

	const firstTestimony =
		'Выражаю благодарность за осуществление мечты! Дом построен! Получилось очень красиво). Оперативно, аккуратно, чётко по проекту. Ребята вежливые, внимательные. На этапе обсуждения проекта давали рекомендации, как лучше сделать, прислушались и учли все пожелания. Во время стройки всегда на связи.  Желаю успеха! Буду рекомендовать.';
	const secondTestimony =
		'Добрый день Друзья!Ребята построили нашу мечту .Прекрасный дом в лесу для зимнего проживания .Все делали качественно ,советовались по деталям.Максимально выполнили наши пожелания.ОГРОМНОЕ ИМ СПАСИБО.Цена просто замечательная ,материалы тоже хорошие.Семья Поповых Оля и Андрей';
	const thirdTestimony =
		'Хочу сказать огромное спасибо компании СК РусДом вчера закончили строительство нашего красивого и уютного дома ребята знающие своë дело сделали всë качественно и без всяких скрытых платежей всë чëтко по договору ребята молодцы👍';
</script>

<section class="mx-auto mt-46 mb-46 max-w-[1440px] px-5">
	<h1 class="text-center text-5xl font-medium max-[600px]:text-4xl">Отзывы наших клиентов</h1>
	<div class="mt-40 flex flex-wrap justify-center gap-6">
		<TestimonyCard
			text={firstTestimony}
			name="Ольга"
			date="16 сентября"
			building="Каркасный дом 9х8 с террасой"
			picture="https://randomuser.me/api/portraits/women/31.jpg"
		/>
		<TestimonyCard
			text={secondTestimony}
			name="Андрей Юрьевич"
			date="7 октября"
			building="Каркасный дом шале 9х7 с утеплением под ключ"
			picture="https://randomuser.me/api/portraits/men/23.jpg"
		/>
		<TestimonyCard
			text={thirdTestimony}
			name="Виталий"
			date="21 ноября"
			building="Каркасный дом 9х9"
			picture="https://randomuser.me/api/portraits/men/76.jpg"
		/>
	</div>
</section>
