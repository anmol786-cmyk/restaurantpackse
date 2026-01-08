<?php
/**
 * Product Quantity Restrictions API Extension
 * 
 * Add this to your WordPress functions.php or as a custom plugin
 * Exposes product quantity limits via REST API
 */

// Add custom fields to product REST API response
add_filter('woocommerce_rest_prepare_product_object', 'add_quantity_restrictions_to_api', 10, 3);
function add_quantity_restrictions_to_api($response, $product, $request) {
    $product_id = $product->get_id();
    
    // Define your quantity restrictions here
    // Format: product_id => max_quantity
    $quantity_restrictions = array(
        215 => 3,  // Product ID 215: Max 3 units (Sona Masoori promotion)
        // Add more product restrictions as needed
        // Example: 123 => 5,
    );
    
    // Check if this product has a restriction
    $max_quantity = isset($quantity_restrictions[$product_id]) ? $quantity_restrictions[$product_id] : null;
    
    // Add to API response
    $response->data['quantity_restriction'] = array(
        'is_restricted' => !is_null($max_quantity),
        'max_quantity' => $max_quantity,
        'message' => $max_quantity ? sprintf(
            '🚫 Maximum %d units allowed for this promotional product.',
            $max_quantity
        ) : null,
    );
    
    return $response;
}

// Optional: Also add to product meta for direct access
add_action('woocommerce_product_options_inventory_product_data', 'add_quantity_restriction_field');
function add_quantity_restriction_field() {
    woocommerce_wp_text_input(array(
        'id' => '_max_quantity_restriction',
        'label' => __('Maximum Quantity Per Order', 'woocommerce'),
        'desc_tip' => true,
        'description' => __('Set maximum quantity allowed per order. Leave empty for no limit.', 'woocommerce'),
        'type' => 'number',
        'custom_attributes' => array(
            'step' => '1',
            'min' => '1'
        )
    ));
}

// Save the custom field
add_action('woocommerce_process_product_meta', 'save_quantity_restriction_field');
function save_quantity_restriction_field($product_id) {
    $max_qty = isset($_POST['_max_quantity_restriction']) ? sanitize_text_field($_POST['_max_quantity_restriction']) : '';
    update_post_meta($product_id, '_max_quantity_restriction', $max_qty);
}

// Existing validation hooks remain unchanged
add_filter('woocommerce_add_to_cart_validation', 'ideal_limit_quantity_add_to_cart', 10, 3);
function ideal_limit_quantity_add_to_cart($passed, $product_id, $quantity) {
    $target_product_id = 215;
    $max_allowed       = 3;

    if ($product_id == $target_product_id) {
        // Current qty in cart
        $current_qty = 0;
        foreach (WC()->cart->get_cart() as $item) {
            if ($item['product_id'] == $target_product_id) {
                $current_qty += $item['quantity'];
            }
        }

        if (($current_qty + $quantity) > $max_allowed) {
            wc_add_notice('🚫 You can only purchase a maximum of 3 units of this promotional product.', 'error');
            return false;
        }
    }

    return $passed;
}

// BLOCK CART QTY CHANGES
add_filter('woocommerce_update_cart_validation', 'ideal_limit_quantity_cart_update', 10, 4);
function ideal_limit_quantity_cart_update($passed, $cart_item_key, $values, $quantity) {
    $target_product_id = 215;
    $max_allowed       = 3;

    if ($values['product_id'] == $target_product_id && $quantity > $max_allowed) {
        wc_add_notice('🚫 Maximum 3 units allowed for this promotional product.', 'error');
        return false;
    }
    return $passed;
}

// AUTO-FIX QTY DURING CART CALCULATIONS
add_action('woocommerce_before_calculate_totals', 'ideal_force_max_qty_in_cart', 10, 1);
function ideal_force_max_qty_in_cart($cart) {
    $target_product_id = 215;
    $max_allowed       = 3;

    if (is_admin() && !defined('DOING_AJAX')) return;

    foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
        if ($cart_item['product_id'] == $target_product_id && $cart_item['quantity'] > $max_allowed) {
            // Force the quantity back to max limit
            $cart->set_quantity($cart_item_key, $max_allowed);
            wc_add_notice('⚠️ Quantity adjusted. Only 3 units allowed for this promotional product.', 'notice');
        }
    }
}
