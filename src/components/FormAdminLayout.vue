<template>
	<q-page class="flex bg_color_page">
		 <div class="column items-stretch" style="width:100%"> 			
			<header id="header"> 
				<slot name="header"></slot>
			</header>		
			<!-- aqui se injecta el q-table y su posible footer -->			
			<slot></slot>						
			<!-- aqui de usa el list view y su posible footer -->			
			<q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle"  style="height:100%; display:flex;flex-direction:column;flex: 1;" 
				id="scroll-area-with-virtual-scroll-1" v-if="$q.screen.lt.md"> 
				<slot name="list_view">
				</slot>
			</q-scroll-area>												
			<q-footer id="footer">
				<slot name="footer"></slot>								
			</q-footer>
		</div>
	</q-page>
</template>

<script>

export default {

	name: "form-admin-layout",	
	
	data(){
		return{
			thumbStyle: {
    		right: '5px',
    		borderRadius: '8px',
        	backgroundColor: '#027be3',
        	width: '8px',
        	opacity: 0.75
    		},
    		barStyle: {
    			right: '2px',
        		borderRadius: '14px',
        		backgroundColor: '#027be3',
        		width: '14px',
        		opacity: 0.2,
        		marginTop: '-3px',
        		marginBottom: '-3px',
        		paddingTop: '3px',
        		paddingBottom: '3px'
			}	
		}
	},

	methods:{
		myTweak (offset) {				
			return { maxHeight: `calc(50vh - ${offset}px) !important` }
		}
	},
}
</script>


