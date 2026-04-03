#output "public_ip" {
#  value = aws_instance.devsecops_ec2.public_ip
#}

output "public_ip" {
  value = aws_eip.devsecops_eip.public_ip
}